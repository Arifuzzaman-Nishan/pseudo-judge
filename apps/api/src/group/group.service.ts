import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupHelperService } from './utils/groupHelper.service';
import mongoose from 'mongoose';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupHelperService: GroupHelperService,
  ) {}

  async createGroup(dto: any) {
    const enrollmentKey = this.groupHelperService.generateEnrollmentKey();

    const newDto = { ...dto, enrollmentKey };
    console.log('newDto is ', newDto);

    const result = await this.groupRepository.create({
      ...dto,
      enrollmentKey: enrollmentKey,
    });
    return result;
  }

  findAllGroups() {
    return this.groupRepository.findAll({});
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

  async problemsAddedIntoGroup(dto: any) {
    const { problemIds, groupId } = dto;
    console.log('dtos is ', dto);

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
}
