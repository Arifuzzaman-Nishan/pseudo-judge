import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/user/user.schema';

export type ProblemSubmissionDocument = HydratedDocument<ProblemSubmission>;

@Schema({
  timestamps: true,
})
export class ProblemSubmission {
  @Prop({
    required: true,
  })
  status: string;

  @Prop({
    required: true,
  })
  language: string;

  @Prop({
    required: true,
  })
  runId: number;

  @Prop({
    required: true,
  })
  code: string;

  @Prop({
    required: true,
  })
  memory: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: null,
  })
  user: User;
}

export const ProblemSubmissionSchema =
  SchemaFactory.createForClass(ProblemSubmission);
