import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProblemDetailsDocument = HydratedDocument<ProblemDetail>;

// class TableData {
//   @Prop({ required: true })
//   columns: string[];

//   @Prop({ required: true })
//   rows: string[][];
// }

// class Description {
//   @Prop({ required: true })
//   type: string;

//   @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
//   content: string | TableData;
// }

@Schema({
  timestamps: true,
})
export class ProblemDetail {
  @Prop({ required: true })
  timeLimit: string;

  @Prop({ required: true })
  memoryLimit: string;

  @Prop({ required: true })
  problemDescriptionHTML: string;

  // @Prop({
  //   required: true,
  //   type: [Description],
  // })
  // problemDescription: Description[];

  @Prop({
    required: true,
  })
  inputDescription: string;

  @Prop({
    required: true,
  })
  outputDescription: string;

  @Prop({
    required: true,
  })
  sampleInput: string;

  @Prop({
    required: true,
  })
  sampleOutput: string;

  @Prop({
    default: null,
  })
  notes: string;
}

export const ProblemDetailsSchema = SchemaFactory.createForClass(ProblemDetail);
