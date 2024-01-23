import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import { ProblemSubmissionRepository } from '@/problem/repositories/problemSubmission.repository';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly problemSubmissionRepository: ProblemSubmissionRepository,
  ) {}

  async createUser(dto: any) {
    const { password, confirmPassword, ...restdto } = dto;

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const userExists = await this.userRepository.findOne({
      email: dto.email,
    });

    if (userExists) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const imageUrl = gravatar.url(dto.email, {
      protocol: 'https',
      s: '70',
    });

    const newUser = (
      await this.userRepository.create({
        ...restdto,
        password: passwordHash,
        imageUrl,
      })
    ).toObject({
      versionKey: false,
    });

    return {
      msg: 'User created successfully',
      ...newUser,
    };
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne(
      {
        username,
      },
      {
        password: 0,
        __v: 0,
      },
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await this.userRepository.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(user._id) } },
      {
        $lookup: {
          from: 'problemsubmissions',
          localField: '_id',
          foreignField: 'user',
          as: 'submissions',
          pipeline: [
            {
              $lookup: {
                from: 'problems',
                localField: 'problem',
                foreignField: '_id',
                as: 'problemData',
              },
            },
            {
              $unwind: {
                path: '$problemData',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                status: 1,
                runtime: 1,
                language: 1,
                code: 1,
                memory: 1,
                createdAt: 1,
                problem: 1,
                title: '$problemData.title',
                ojName: '$problemData.ojName',
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$submissions',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          'submissions.createdAt': -1,
        },
      },

      // Grouping for unique count and all submissions
      {
        $group: {
          _id: '$_id',
          userDoc: { $first: '$$ROOT' },
          totalAttempts: { $sum: { $cond: ['$submissions', 1, 0] } },
          submissions: { $push: '$submissions' },
          uniqueAccepted: {
            $addToSet: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$submissions.status', 'Accepted'] },
                    '$submissions.problem',
                  ],
                },
                '$submissions.problem',
                null,
              ],
            },
          },
          last7daysAccepted: {
            $addToSet: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$submissions.status', 'Accepted'] },
                    { $gte: ['$submissions.createdAt', sevenDaysAgo] },
                    '$submissions.problem',
                  ],
                },
                '$submissions.problem',
                null,
              ],
            },
          },
        },
      },

      // Count unique accepted and last 7 days accepted problems
      {
        $addFields: {
          totalAccepted: {
            $size: {
              $filter: {
                input: '$uniqueAccepted',
                as: 'item',
                cond: { $ne: ['$$item', null] },
              },
            },
          },
          totalLast7daysAccepted: {
            $size: {
              $filter: {
                input: '$last7daysAccepted',
                as: 'item',
                cond: { $ne: ['$$item', null] },
              },
            },
          },
          acceptedSubmissions: {
            $filter: {
              input: '$submissions',
              as: 'submission',
              cond: { $eq: ['$$submission.status', 'Accepted'] },
            },
          },
        },
      },

      // Lookup for group data
      {
        $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: 'users',
          as: 'groupData',
        },
      },

      // Final projection
      {
        $project: {
          _id: 1,
          fullName: '$userDoc.fullName',
          imageUrl: '$userDoc.imageUrl',
          username: '$userDoc.username',
          email: '$userDoc.email',
          role: '$userDoc.role',
          createdAt: '$userDoc.createdAt',
          updatedAt: '$userDoc.updatedAt',
          submissionCount: {
            totalAttempts: '$totalAttempts',
            totalAccepted: '$totalAccepted',
            last7daysAccepted: '$totalLast7daysAccepted',
          },
          totalSubmissions: '$submissions',
          acceptedSubmissions: 1,
          groupData: { $ifNull: ['$groupData', []] },
        },
      },
      {
        $addFields: {
          'group.userIsInGroup': { $gt: [{ $size: '$groupData' }, 0] },
          'group.groupName': { $arrayElemAt: ['$groupData.groupName', 0] },
        },
      },
      {
        $project: {
          groupData: 0,
          userDoc: 0,
        },
      },
    ]);

    return result[0];
  }

  async findRankings(search: string) {
    let searchQuery: {
      role: { $ne: string };
      username?: { $regex: string; $options: string };
    } = {
      role: { $ne: 'admin' },
    };

    if (search) {
      searchQuery = {
        ...searchQuery,
        username: { $regex: search, $options: 'i' },
      };
    }

    return this.userRepository.aggregate([
      {
        $match: searchQuery,
      },
      {
        $lookup: {
          from: 'problemsubmissions',
          localField: '_id',
          foreignField: 'user',
          as: 'submissions',
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          acceptedSubmissions: {
            $filter: {
              input: '$submissions',
              as: 'submission',
              cond: {
                $regexMatch: {
                  input: '$$submission.status',
                  regex: /^accepted$/i,
                },
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: '$acceptedSubmissions',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          fullName: { $first: '$fullName' },
          uniqueProblemsSolved: { $addToSet: '$acceptedSubmissions.problem' },
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          solvedCount: { $size: '$uniqueProblemsSolved' },
        },
      },
      {
        $sort: {
          solvedCount: -1,
        },
      },
    ]);
  }
}
