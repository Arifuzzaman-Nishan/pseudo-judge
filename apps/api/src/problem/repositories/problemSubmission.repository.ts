import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseAbstractRepository } from 'src/shared/repository/base.abstract.repository';
import { Model } from 'mongoose';
import {
  ProblemSubmission,
  ProblemSubmissionDocument,
} from '../schemas/problemSubmission.schema';

@Injectable()
export class ProblemSubmissionRepository extends BaseAbstractRepository<ProblemSubmissionDocument> {
  constructor(
    @InjectModel(ProblemSubmission.name)
    protected readonly problemSubmissionModel: Model<ProblemSubmissionDocument>,
  ) {
    super(problemSubmissionModel);
  }
}
