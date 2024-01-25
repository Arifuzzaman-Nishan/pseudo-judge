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

  getDaySuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  formatDateWithSuffix(date: DateTime) {
    const day = date.day;
    const suffix = this.getDaySuffix(day);
    return `${day}${suffix} ${date.monthLong} ${date.year}`;
  }

  generateCutoffNotice(cutoffNumber: number, cutoffDate: DateTime) {
    const formattedCutoffDate = this.formatDateWithSuffix(cutoffDate);

    return `Those with < ${cutoffNumber} problems solved on ${formattedCutoffDate} will be removed from this group`;
  }
}
