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

  @Prop({ default: null })
  memoryLimit: string;

  @Prop({ default: null })
  problemDescriptionHTML: string;

  @Prop({ default: null })
  pdfUrl: string;

  // @Prop({
  //   required: true,
  //   type: [Description],
  // })
  // problemDescription: Description[];

  @Prop({
    default: null,
  })
  inputDescription: string;

  @Prop({
    default: null,
  })
  outputDescription: string;

  @Prop({
    default: null,
  })
  sampleInput: string;

  @Prop({
    default: null,
  })
  sampleOutput: string;

  @Prop({
    default: null,
  })
  notes: string;
}

export const ProblemDetailsSchema = SchemaFactory.createForClass(ProblemDetail);
