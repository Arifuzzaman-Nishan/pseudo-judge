import { Prop, Schema } from '@nestjs/mongoose';

export enum CutoffInterval {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  EVERYDAY = 'everyday',
}

@Schema({
  timestamps: true,
})
export class Cutoff {
  @Prop({
    required: true,
  })
  cutoffNumber: number;

  @Prop({
    required: true,
  })
  initialCutoffNumber: number;

  @Prop({
    required: true,
    default: CutoffInterval.WEEKLY,
    enum: CutoffInterval,
  })
  cutoffInterval: CutoffInterval;

  @Prop({
    required: true,
  })
  cutoffDate: Date;
}
