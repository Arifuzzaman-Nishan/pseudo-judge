import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseAbstractRepository } from 'src/shared/repository/base.abstract.repository';
import { Model } from 'mongoose';
import {
  ProblemDetail,
  ProblemDetailsDocument,
} from '../schemas/problemDetails.schema';

@Injectable()
export class ProblemDetailsRepository extends BaseAbstractRepository<ProblemDetailsDocument> {
  constructor(
    @InjectModel(ProblemDetail.name)
    protected readonly problemDetailsModel: Model<ProblemDetailsDocument>,
  ) {
    super(problemDetailsModel);
  }
}
