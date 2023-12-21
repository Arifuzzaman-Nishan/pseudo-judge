export type HttpExceptionResponse = {
  statusCode: number;
  error: string;
  stack?: string;
};

export type CustomHttpExceptionResponse = {
  path: string;
  method: string;
  timestamp: Date;
} & HttpExceptionResponse;
