import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    response: {
      status: HttpStatus;
      error: string;
    },
    status: HttpStatus,
  ) {
    super(response, status);
  }
}
