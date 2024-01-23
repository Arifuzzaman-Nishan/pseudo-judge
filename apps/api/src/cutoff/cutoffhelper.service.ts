import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { CutoffInterval } from './cutoff.schema';

@Injectable()
export class CutoffHelperService {
  getBangladeshTime() {
    return DateTime.utc().plus({ hours: 6 });
  }

  calculateNextCutoffDate(currentDate: Date, interval: string): DateTime {
    const date = DateTime.fromJSDate(currentDate);
    switch (interval) {
      case CutoffInterval.WEEKLY:
        return date.plus({ weeks: 1 });
      case CutoffInterval.MONTHLY:
        return date.plus({ months: 1 });
      case CutoffInterval.EVERYDAY:
        return date.plus({ days: 1 });
      default:
        throw new Error('Invalid cutoff interval');
    }
  }
}
