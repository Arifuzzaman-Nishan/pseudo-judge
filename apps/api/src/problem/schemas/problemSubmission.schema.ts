import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/user/user.schema';
import { Problem } from './problem.schema';
import { Group } from '@/group/group.schema';

export type ProblemSubmissionDocument = HydratedDocument<ProblemSubmission>;

enum Status {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  LOADING = 'loading',
  WRONG_ANSWER = 'Wrong Answer',
  ACCEPTED = 'Accepted',
  COMPILATION_ERROR = 'Compilation Error',
  RUNTIME_ERROR = 'Runtime Error',
  TIME_LIMIT = 'Time Limit',
  MEMORY_LIMIT = 'Memory Limit',
  PRESENTATION_ERROR = 'Presentation Error',
}

@Schema({
  timestamps: true,
})
export class ProblemSubmission {
  @Prop({
    required: true,
    default: Status.PENDING,
    enum: Status,
  })
  status: Status;

  @Prop({
    default: true,
  })
  processing: boolean;

  @Prop({
    default: null,
  })
  runtime: number;

  @Prop({
    required: true,
  })
  language: string;

  @Prop({
    required: true,
    unique: true,
  })
  runId: number;

  @Prop({
    required: true,
  })
  code: string;

  @Prop({
    default: null,
  })
  memory: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  })
  problem: Problem;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  group: Group;
}

export const ProblemSubmissionSchema =
  SchemaFactory.createForClass(ProblemSubmission);
