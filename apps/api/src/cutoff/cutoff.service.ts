import { GroupRepository } from '@/group/group.repository';
import { ProblemSubmissionRepository } from '@/problem/repositories/problemSubmission.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import mongoose from 'mongoose';
import { CutoffHelperService } from './cutoffhelper.service';
import { GroupHelperService } from '@/group/utils/groupHelper.service';
@Injectable()
export class CutoffService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly problemSubmissionRepository: ProblemSubmissionRepository,
    private readonly cutoffHelperService: CutoffHelperService,
    private readonly groupHelperService: GroupHelperService,
  ) {}

  private readonly logger = new Logger(CutoffService.name);

  async countAcceptedSumissionsSince(userId: string, groupId: string) {
    const result = await this.problemSubmissionRepository.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          group: new mongoose.Types.ObjectId(groupId),
          status: {
            $regex: /^accepted$/i,
          },
        },
      },
      {
        $group: {
          _id: '$problem',
        },
      },
      {
        $count: 'acceptedSubmissions',
      },
    ]);
    return result.length > 0
      ? (result[0] as { acceptedSubmissions: number }).acceptedSubmissions
      : 0;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Dhaka',
  })
  async handleCutoff() {
    this.logger.debug('Called this every day at midnight');

    const today = this.cutoffHelperService.getBangladeshTime();
    const groups = await this.groupRepository.findAll({});

    for (const group of groups) {
      const cutoffDate = DateTime.fromJSDate(group.cutoff.cutoffDate);

      if (today >= cutoffDate) {
        const users = group.users;
        const usersToRemove = [];

        for (const userId of users) {
          const solvedCount = await this.countAcceptedSumissionsSince(
            userId as unknown as string,
            group._id as unknown as string,
          );

          console.log('user solved count is ', solvedCount, userId);

          if (solvedCount < group.cutoff.cutoffNumber) {
            usersToRemove.push(userId);
          }
        }
        group.users = group.users.filter(
          (userId) => !usersToRemove.includes(userId),
        );

        group.cutoff.cutoffDate = this.cutoffHelperService
          .calculateNextCutoffDate(
            group.cutoff.cutoffDate,
            group.cutoff.cutoffInterval,
          )
          .toJSDate();

        group.cutoff.cutoffNumber += group.cutoff.initialCutoffNumber;
        group.cutoff.cutoffNotice =
          this.cutoffHelperService.generateCutoffNotice(
            group.cutoff.cutoffNumber,
            DateTime.fromJSDate(group.cutoff.cutoffDate),
          );
        group.enrollmentKey = this.groupHelperService.generateEnrollmentKey();

        await this.groupRepository.findOneAndUpdate(
          {
            _id: group._id,
          },
          group,
        );
      }
    }
  }
}
