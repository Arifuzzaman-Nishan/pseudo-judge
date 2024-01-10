import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupHelperService } from './utils/groupHelper.service';
import mongoose from 'mongoose';
import { UserRole } from '@/user/user.schema';
import { UserRepository } from '@/user/user.repository';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupHelperService: GroupHelperService,
    private readonly userRepository: UserRepository,
  ) {}

  async createGroup(dto: any) {
    const enrollmentKey = this.groupHelperService.generateEnrollmentKey();

    const result = await this.groupRepository.create({
      ...dto,
      enrollmentKey: enrollmentKey,
    });
    return result;
  }

  async findAllGroups(enrollmentKey: boolean) {
    if (enrollmentKey) {
      return this.groupRepository.aggregate([
        {
          $addFields: {
            totalMembers: {
              $size: '$users',
            },
          },
        },
        {
          $addFields: {
            totalProblems: {
              $size: '$problems',
            },
          },
        },
      ]);
    } else {
      return this.groupRepository.aggregate([
        {
          $addFields: {
            totalMembers: {
              $size: '$users',
            },
          },
        },
        {
          $addFields: {
            totalProblems: {
              $size: '$problems',
            },
          },
        },
        {
          $project: {
            enrollmentKey: 0,
          },
        },
      ]);
    }
  }

  async findGroupById(id: string) {
    const [group] = await this.groupRepository.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          problems: 0,
          __v: 0,
        },
      },
    ]);
    return group;
  }

  async deleteGroup(groupId: string) {
    return this.groupRepository.deleteOne({
      _id: groupId,
    });
  }

  // problem operations
  async problemsAddedIntoGroup(dto: any) {
    const { problemIds, groupId } = dto;

    const group = await this.groupRepository.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    return this.groupRepository.findOneAndUpdate(
      {
        _id: groupId,
      },
      {
        $addToSet: {
          problems: {
            $each: problemIds,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async removeProblemFromGroup(dto: any) {
    const { problemId, groupId } = dto;
    const group = await this.groupRepository.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    return this.groupRepository.findOneAndUpdate(
      {
        _id: groupId,
      },
      {
        $pull: {
          problems: problemId,
        },
      },
      {
        new: true,
      },
    );
  }

  async findGroupAddedProblems(groupId: string) {
    const problems = await this.groupRepository.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(groupId),
        },
      },
      {
        $lookup: {
          from: 'problems',
          localField: 'problems',
          foreignField: '_id',
          as: 'problems',
        },
      },
      {
        $unwind: {
          path: '$problems',
        },
      },
      {
        $replaceRoot: { newRoot: '$problems' },
      },
    ]);

    return problems;
  }

  async findGroupNotAddedProblems(groupId: string) {
    const problems = await this.groupRepository.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(groupId),
        },
      },
      {
        $lookup: {
          from: 'problems',
          let: { problemIds: '$problems' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $not: {
                    $in: ['$_id', '$$problemIds'],
                  },
                },
              },
            },
          ],
          as: 'problems',
        },
      },
      {
        $unwind: {
          path: '$problems',
        },
      },
      {
        $replaceRoot: { newRoot: '$problems' },
      },
    ]);

    return problems;
  }

  // user operations
  async usersAddedIntoGroup(dto: any) {
    const { userIds, groupId } = dto;

    const group = await this.groupRepository.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    return this.groupRepository.findOneAndUpdate(
      {
        _id: groupId,
      },
      {
        $addToSet: {
          users: {
            $each: userIds,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async removeUserFromGroup(dto: any) {
    const { userId, groupId } = dto;
    const group = await this.groupRepository.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    return this.groupRepository.findOneAndUpdate(
      {
        _id: groupId,
      },
      {
        $pull: {
          users: userId,
        },
      },
      {
        new: true,
      },
    );
  }

  async findGroupAddedUsers(groupId: string) {
    const users = await this.groupRepository.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(groupId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $unwind: {
          path: '$users',
        },
      },
      {
        $project: {
          'users.password': 0,
        },
      },
      {
        $replaceRoot: { newRoot: '$users' },
      },
    ]);

    return users;
  }

  async findGroupNotAddedUsers(groupId: string) {
    const users = await this.groupRepository.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(groupId),
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userIds: '$users' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $not: {
                        $in: ['$_id', '$$userIds'],
                      },
                    },
                    {
                      $ne: ['$role', UserRole.ADMIN],
                    },
                  ],
                },
              },
            },
          ],
          as: 'users',
        },
      },
      {
        $unwind: {
          path: '$users',
        },
      },
      {
        $project: {
          'users.password': 0,
        },
      },
      {
        $replaceRoot: { newRoot: '$users' },
      },
    ]);

    return users;
  }

  // enrollment key operations
  async enrollUserToGroup(dto: any) {
    const { groupId, userId, enrollmentKey } = dto;

    const userExists = await this.userRepository.findOne({
      _id: userId,
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (userExists.role === UserRole.ADMIN) {
      throw new HttpException(
        'Admin user cannot join groups',
        HttpStatus.BAD_REQUEST,
      );
    }

    const group = await this.groupRepository.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    if (group.enrollmentKey !== enrollmentKey) {
      throw new HttpException(
        'Enrollment key is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isUserAlreadyInGroup = group.users.some(
      (id) => id.toString() === userId,
    );

    if (isUserAlreadyInGroup) {
      throw new HttpException(
        `User ${userExists.username} is already in group`,
        HttpStatus.BAD_REQUEST,
      );
    }

    group.users.push(userId);
    await group.save();

    return {
      message: 'User enrolled successfully',
    };
  }

  async findAllGroupProblemsByUserId(userId: string) {
    const [groupsWithProblems] = await this.groupRepository.aggregate([
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
        $project: {
          'groupProblems.problemDetails': 0,
          'groupProblems.__v': 0,
        },
      },
      {
        $group: {
          _id: '$_id',
          groupName: { $first: '$groupName' },
          problems: { $push: '$groupProblems' },
        },
      },
    ]);

    return groupsWithProblems || { problems: [], groupName: '', _id: '' };
  }
}
