import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupHelperService {
  generateEnrollmentKey() {
    const enrollmentKey =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    return enrollmentKey;
  }
}
