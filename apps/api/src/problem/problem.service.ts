import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '@/user/user.repository';
import { ProblemSubmissionRepository } from './repositories/problemSubmission.repository';
import { GroupRepository } from '@/group/group.repository';

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
  problemId: string;
  userId: string;
  groupId: string;
};

@Injectable()
export class ProblemService {
  constructor(
    private readonly puppeteerService: PuppeteerService,
    private readonly problemRepository: ProblemRepository,
    private readonly problemDetailsRepository: ProblemDetailsRepository,
    private readonly vjudgeService: VjudgeService,
    private readonly userRepository: UserRepository,
    private readonly problemSubmissionRepository: ProblemSubmissionRepository,
    private readonly groupRepository: GroupRepository,
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

  async findGroupProblems(groupId: string) {
    const problems = await this.problemRepository.findAll({
      groupId,
    });
    return problems;
  }

  async submitCode(dto: SubmitCodeDto) {
    const { userId, problemId, groupId } = dto;

    console.log('submit code dto is ', dto);

    const user = await this.userRepository.findOne({
      _id: userId,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const problem = await this.problemRepository.findOne({
      _id: problemId,
    });

    if (!problem) {
      throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
    }

    const group = await this.groupRepository.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    dto.codeStr = `// ${uuidv4()}\n${dto.codeStr}`;
    console.log('dto is ', dto);
    await this.vjudgeService.login();
    console.log('login is done');
    const codeSubmitRes = await this.vjudgeService.submitCode(dto);

    // console.log('codeSubmitRes is ', codeSubmitRes.runId);

    await this.problemSubmissionRepository.create({
      code: dto.codeStr,
      language: dto.lang,
      runId: codeSubmitRes.runId,
      user: user,
      problem: problem,
      group: group,
    });

    return codeSubmitRes;

    // console.log('codeSubmitRes is ', codeSubmitRes);
    // const result = await this.vjudgeService.solution({
    //   runId: codeSubmitRes.runId,
    // });
    // console.log('result is ', result);
    // return result;
  }

  async solution(runId: string) {
    console.log('runId is ', runId);

    const result = await this.vjudgeService.solution({
      runId: runId,
    });

    console.log('code solution is ', result);

    return this.problemSubmissionRepository.findOneAndUpdate(
      {
        runId: runId,
      },
      {
        status: result.status,
        processing: result.processing,
        runtime: result?.runtime,
        memory: result?.memory,
      },
    );
  }

  async findProblemSubmissions({
    userId,
    query,
  }: {
    userId: string;
    query: {
      problemId?: string;
      groupId: string;
    };
  }) {
    console.log('query is ', query);
    const { problemId, groupId } = query;

    const user = await this.userRepository.findOne({
      _id: userId,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.problemSubmissionRepository.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          problem: new mongoose.Types.ObjectId(problemId),
          group: new mongoose.Types.ObjectId(groupId),
        },
      },
      {
        $lookup: {
          from: 'problems',
          localField: 'problem',
          foreignField: '_id',
          as: 'problem',
        },
      },
      {
        $unwind: {
          path: '$problem',
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          processing: 1,
          runtime: 1,
          language: 1,
          runId: 1,
          code: 1,
          memory: 1,
          title: '$problem.title',
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }
}
