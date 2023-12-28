import { Problem } from '@/problem/schemas/problem.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema({
  timestamps: true,
})
export class Group {
  @Prop({
    required: true,
    unique: true,
  })
  groupName: string;

  @Prop({
    required: true,
    unique: true,
  })
  enrollmentKey: string;

  @Prop({
    // required: true,
    default: 0,
  })
  totalMembers: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    default: [],
  })
  problems: Problem[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
