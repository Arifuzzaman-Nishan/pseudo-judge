import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseAbstractRepository } from 'src/shared/repository/base.abstract.repository';
import { ProblemDocument } from '../schemas/problem.schema';
import { Problem } from '../schemas/problem.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProblemRepository extends BaseAbstractRepository<ProblemDocument> {
  constructor(
    @InjectModel(Problem.name)
    protected readonly problemModel: Model<ProblemDocument>,
  ) {
    super(problemModel);
  }
}
