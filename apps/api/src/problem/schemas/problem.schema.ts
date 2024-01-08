import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OJName } from '../problem.service';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProblemDetail } from './problemDetails.schema';

export enum DifficultyRating {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export type ProblemDocument = HydratedDocument<Problem>;

@Schema({
  timestamps: true,
})
export class Problem {
  @Prop({
    required: true,
  })
  url: string;

  @Prop({
    default: null,
  })
  ojProblemId: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    enum: DifficultyRating,
    default: DifficultyRating.EASY,
  })
  difficultyRating: DifficultyRating;

  @Prop({
    required: true,
    enum: OJName,
  })
  ojName: OJName;

  @Prop({
    default: 0,
  })
  totalSolved: number;

  @Prop({
    default: 0,
  })
  totalSubmission: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProblemDetail',
    required: true,
  })
  problemDetails: ProblemDetail;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
