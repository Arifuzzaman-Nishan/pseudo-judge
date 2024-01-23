import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from './http-exception-response.interface';
// import { ThrottlerException } from '@nestjs/throttler';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  private environment = (): boolean =>
    process.env.NODE_ENV === 'development' ?? false;

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timestamp: new Date(),
  });

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;
    let stack: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage =
        (errorResponse as HttpExceptionResponse).error || exception.message;
      stack = exception.stack;

      //   if (exception instanceof ThrottlerException) {
      //     errorMessage =
      //       'Too many requests. Please try again after 3 minitues later.';
      //   }
    } else if (exception instanceof MongoError) {
      this.logger.error(exception.name);

      const { message, code } = exception;
      stack = exception.stack;
      status = HttpStatus.BAD_REQUEST;

      switch (code) {
        case 11000:
          status = HttpStatus.CONFLICT;
          errorMessage = this.environment() ? message : 'Duplicate key error';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          errorMessage = this.environment()
            ? message
            : 'Critical Internal server error';
      }
    } else if (exception instanceof Error.ValidationError) {
      const { message, name } = exception;
      this.logger.error(name);

      status = HttpStatus.BAD_REQUEST;
      errorMessage = this.environment() ? message : name;
      stack = exception.stack;
    } else {
      this.logger.error('other exception...', exception.toString());

      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critical Internal Server Error';

      //   if (exception.toString().includes('Cannot get account info')) {
      //     status = HttpStatus.BAD_REQUEST;
      //     errorMessage = 'Cannot get account info';
      //   } else {

      //   }

      stack = exception.toString();
    }

    const errorResponse = this.getErrorResponse(status, errorMessage, request);

    if (this.environment()) {
      errorResponse.stack = stack;
    }
    response.status(status).json(errorResponse);
  }
}
