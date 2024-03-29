import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CrawlProblemsDto } from './problem.controller';
import { PuppeteerService } from '@/utils/puppeteer/puppeteer.service';
import { ProblemRepository } from './repositories/problem.repository';
import { ProblemDetailsRepository } from './repositories/problemDetails.repository';
import {
  ProblemKey,
  lightOjSelectors,
  timusOjSelectors,
  uvaOjSelectors,
} from './assets/selector';
import mongoose from 'mongoose';
import { VjudgeService } from '@/utils/vjudge/vjudge.service';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '@/user/user.repository';
import { ProblemSubmissionRepository } from './repositories/problemSubmission.repository';
import { GroupRepository } from '@/group/group.repository';
import axios from 'axios';

export enum OJName {
  TIMUS = 'timus',
  CODEFORCES = 'codeforces',
  UVA = 'UVA',
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

  async getPdfUrl(url: string) {
    try {
      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'arraybuffer',
      });

      const pdfBase64 = Buffer.from(response.data, 'binary').toString('base64');
      const fileUrl = `data:application/pdf;base64,${pdfBase64}`;

      return fileUrl;
    } catch (err: any) {
      return null;
    }
  }

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
      pdfUrl: '',
      inputDescription: '',
      sampleInput: '',
      sampleOutput: '',
      outputDescription: '',
    };

    let selectorData = [];
    if (ojName === OJName.LOJ) {
      selectorData = lightOjSelectors;
    } else if (ojName === OJName.TIMUS) {
      selectorData = timusOjSelectors;
    } else if (ojName === OJName.UVA) {
      selectorData = uvaOjSelectors;
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

    const newPdfUrl = await this.getPdfUrl(problemData.pdfUrl);

    if (!newPdfUrl && ojName === OJName.UVA) {
      throw new HttpException(
        'Failed to crawl problem',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const problemDetails = await this.problemDetailsRepository.create({
      ...problemDetailsData,
      newPdfUrl,
    });

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

  async totalSolvedCount(problemId: string) {
    const result = await this.problemSubmissionRepository.aggregate<any>([
      {
        $match: {
          problem: new mongoose.Types.ObjectId(problemId),
        },
      },
      {
        $facet: {
          totalSubmission: [
            {
              $count: 'count',
            },
          ],
          totalSolved: [
            {
              $match: {
                status: 'Accepted',
              },
            },
            {
              $group: {
                _id: '$user',
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    const totalSubmission = result[0].totalSubmission[0]?.count || 0;
    const totalSolved = result[0].totalSolved[0]?.count || 0;

    return { totalSubmission, totalSolved };
  }

  async findAllProblemsOrGroupProblems(userId: string, search: string) {
    let groupsWithProblems = null;

    const group = await this.groupRepository.findOne({
      users: {
        $in: [new mongoose.Types.ObjectId(userId)],
      },
    });

    // Check if group is not null before calling toObject
    const groupObject = group ? group.toObject() : null;
    const isUserInGroup = groupObject != null;

    const searchQuery = {};
    if (search && !isUserInGroup) {
      searchQuery['title'] = { $regex: search, $options: 'i' };
    } else if (search && isUserInGroup) {
      searchQuery['groupProblems.title'] = { $regex: search, $options: 'i' };
    }

    if (userId && isUserInGroup) {
      [groupsWithProblems] = await this.groupRepository.aggregate<{
        problems: Array<{
          _id: string;
          totalSolved: number;
          totalSubmission: number;
        }>;
      }>([
        {
          $match: {
            users: { $in: [new mongoose.Types.ObjectId(userId)] },
          },
        },
        {
          $lookup: {
            from: 'problems',
            localField: 'problems',
            foreignField: '_id',
            as: 'groupProblems',
          },
        },
        {
          $unwind: {
            path: '$groupProblems',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: searchQuery,
        },
        {
          $project: {
            'groupProblems.problemDetails': 0,
            'groupProblems.__v': 0,
          },
        },
        {
          $group: {
            _id: '$_id',
            groupName: { $first: '$groupName' },
            cutoffNotice: { $first: '$cutoff.cutoffNotice' },
            problems: { $push: '$groupProblems' },
          },
        },
      ]);
    } else {
      const allProblems = await this.problemRepository.findAll(searchQuery);
      groupsWithProblems = {
        _id: '',
        groupName: '',
        problems: allProblems,
      };
    }

    if (!groupsWithProblems) {
      return { problems: [], groupName: '', _id: '' };
    }

    for (const problem of groupsWithProblems.problems) {
      const count = await this.totalSolvedCount(problem._id);
      problem.totalSolved = count?.totalSolved || 0;
      problem.totalSubmission = count?.totalSubmission || 0;
    }

    return groupsWithProblems;
  }

  async findOne(problemId: string) {
    const [problem] = await this.problemRepository.aggregate([
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

    return problem;
  }

  async deleteRelatedProblem(problemId: string, problemDetailsId: string) {
    await this.problemDetailsRepository.deleteOne({
      _id: problemDetailsId,
    });

    await this.groupRepository.updateMany(
      {
        problems: {
          $in: [problemId],
        },
      },
      {
        $pull: {
          problems: problemId,
        },
      },
    );

    await this.problemSubmissionRepository.deleteOne({
      problem: problemId,
    });
  }

  async deleteProblem(problemId: string) {
    const problem = await this.problemRepository.findOne({
      _id: problemId,
    });

    if (!problem) {
      throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
    }

    await this.problemRepository.deleteOne({
      _id: problemId,
    });

    await this.deleteRelatedProblem(
      problemId,
      problem.problemDetails as unknown as string,
    );

    return {
      message: 'Problem deleted successfully',
    };
  }

  async findGroupProblems(groupId: string) {
    const problems = await this.problemRepository.findAll({
      groupId,
    });
    return problems;
  }

  async submitCode(dto: SubmitCodeDto) {
    const { userId, problemId, groupId } = dto;

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

    await this.vjudgeService.login();
    const codeSubmitRes = await this.vjudgeService.submitCode(dto);

    if (!codeSubmitRes?.runId) {
      throw new HttpException(
        'Code submission failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.problemSubmissionRepository.create({
      status: 'Pending',
      code: dto.codeStr,
      language: dto.lang,
      runId: codeSubmitRes.runId,
      user: user,
      problem: problem,
      group: group,
    });

    return codeSubmitRes;
  }

  async solution(runId: string) {
    const result = await this.vjudgeService.solution({
      runId: runId,
    });

    if (!result) {
      throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
    }

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
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }
}
