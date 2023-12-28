import { BaseAbstractRepository } from '@/shared/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './group.schema';

@Injectable()
export class GroupRepository extends BaseAbstractRepository<GroupDocument> {
  constructor(
    @InjectModel(Group.name)
    private readonly groupModel: Model<GroupDocument>,
  ) {
    super(groupModel);
  }
}
