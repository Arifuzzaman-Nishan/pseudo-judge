import { Injectable } from '@nestjs/common';
import { CrawlProblemsDto } from './problem.controller';
import { PuppeteerService } from '@/utils/puppeteer/puppeteer.service';
import { ProblemRepository } from './repositories/problem.repository';
import { ProblemDetailsRepository } from './repositories/problemDetails.repository';
import {
  ProblemKey,
  lightOjSelectors,
  timusOjSelectors,
} from './assets/selector';
import mongoose from 'mongoose';
import { VjudgeService } from '@/utils/vjudge/vjudge.service';

export enum OJName {
  TIMUS = 'timus',
  CODEFORCES = 'codeforces',
  UVA = 'uva',
  SPOJ = 'spoj',
  LOJ = 'LightOJ',
}

export type SubmitCodeDto = {
  codeStr: string;
  lang: string;
  ojName: string;
  ojProblemId: string;
};

@Injectable()
export class ProblemService {
  constructor(
    private readonly puppeteerService: PuppeteerService,
    private readonly problemRepository: ProblemRepository,
    private readonly problemDetailsRepository: ProblemDetailsRepository,
    private readonly vjudgeService: VjudgeService,
  ) {}

  async crawlProblems(dto: CrawlProblemsDto) {
    const { url, ojName } = dto;
    await this.puppeteerService.launch({
      headless: 'new',
    });

    await this.puppeteerService.goto(url);

    const problemData: Record<ProblemKey, string> = {
      ojProblemId: '',
      title: '',
      timeLimit: '',
      memoryLimit: '',
      problemDescriptionHTML: '',
      inputDescription: '',
      sampleInput: '',
      sampleOutput: '',
      outputDescription: '',
    };

    let selectorData = lightOjSelectors;
    if (ojName === OJName.LOJ) {
      selectorData = lightOjSelectors;
    } else if (ojName === OJName.TIMUS) {
      selectorData = timusOjSelectors;
    }

    await Promise.all(
      selectorData.map(async (item) => {
        if (item.key === 'problemDescriptionHTML') {
          if (ojName === OJName.LOJ) {
            problemData[item.key] =
              await this.puppeteerService.getLightOjProblemDescription(
                item.selector as string,
              );
          } else if (ojName === OJName.TIMUS) {
            problemData[item.key] =
              await this.puppeteerService.getTimusOjProblemDescription(
                item.selector as string,
              );
          }
        } else {
          problemData[item.key] =
            await this.puppeteerService.getDataFromHTMLSelector(item.selector);
        }
      }),
    );

    await this.puppeteerService.close();

    const { title, ojProblemId, ...problemDetailsData } = problemData;
    const problemDetails =
      await this.problemDetailsRepository.create(problemDetailsData);

    const finalProblemData = {
      ...dto,
      title,
      ojProblemId,
      problemDetails: problemDetails,
    };
    return this.problemRepository.create(finalProblemData);
  }

  async findAll() {
    return this.problemRepository.findAll({});
  }

  async findOne(problemId: string) {
    console.log('problemId is ', problemId);

    const [problemDetails] = await this.problemRepository.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(problemId),
        },
      },
      {
        $lookup: {
          from: 'problemdetails',
          localField: 'problemDetails',
          foreignField: '_id',
          as: 'problemDetails',
        },
      },
      {
        $unwind: {
          path: '$problemDetails',
        },
      },
    ]);

    return problemDetails;
  }

  async submitCode(dto: SubmitCodeDto) {
    console.log('dto is ', dto);

    await this.vjudgeService.login();
    const codeSubmitRes = await this.vjudgeService.submitCode(dto);

    console.log('codeSubmitRes is ', codeSubmitRes);
    const result = await this.vjudgeService.solution({
      runId: codeSubmitRes.runId,
    });
    console.log('result is ', result);
    return result;

    // const { ojName, problemNum, code } = dto;
  }

  async findGroupProblems(groupId: string) {
    const problems = await this.problemRepository.findAll({
      groupId,
    });
    return problems;
  }
}
