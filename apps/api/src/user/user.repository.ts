import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseAbstractRepository } from 'src/shared/repository/base.abstract.repository';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserRepository extends BaseAbstractRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    protected readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
