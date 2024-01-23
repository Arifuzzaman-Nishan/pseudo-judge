import { GroupRepository } from '@/group/group.repository';
import { ProblemSubmissionRepository } from '@/problem/repositories/problemSubmission.repository';
import { Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import mongoose from 'mongoose';

export class CutoffService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly problemSubmissionRepository: ProblemSubmissionRepository,
  ) {}

  private readonly logger = new Logger(CutoffService.name);

  getBangladeshTime() {
    return DateTime.utc().plus({ hours: 6 });
  }

  async countAcceptedSumissionsSince(userId: string, groupId: string) {
    const result = await this.problemSubmissionRepository.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          group: new mongoose.Types.ObjectId(groupId),
          status: 'accepted',
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

  private calculateNextCutoffDate(
    currentDate: Date,
    interval: string,
  ): DateTime {
    const date = DateTime.fromJSDate(currentDate);
    switch (interval) {
      case 'weekly':
        return date.plus({ weeks: 1 });
      case 'monthly':
        return date.plus({ months: 1 });
      default:
        throw new Error('Invalid cutoff interval');
    }
  }

  async handleCutoff() {
    this.logger.debug('Called when the current second is 45');
    const today = this.getBangladeshTime();
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

          if (solvedCount < group.cutoff.cutoffNumber) {
            usersToRemove.push(userId);
          }
        }
        group.users = group.users.filter(
          (userId) => !usersToRemove.includes(userId),
        );

        group.cutoff.cutoffDate = this.calculateNextCutoffDate(
          group.cutoff.cutoffDate,
          group.cutoff.cutoffInterval,
        ).toJSDate();

        group.cutoff.cutoffNumber += group.cutoff.initialCutoffNumber;

        await this.groupRepository.findOneAndUpdate(
          {
            _id: group._id,
          },
          group,
        );
      }
    }
  }

  //   @Cron('45 * * * * *')
}
