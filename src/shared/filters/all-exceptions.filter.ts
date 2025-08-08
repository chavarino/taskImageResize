// src/shared/filters/simple-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class SimpleExceptionsFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();

    const req = ctx.getRequest<unknown>();
    const res = ctx.getResponse<unknown>();

    const path = httpAdapter.getRequestUrl(req) as unknown;

    console.error(exception);

    if (exception instanceof HttpException) {
      httpAdapter.reply(res, exception.getResponse(), exception.getStatus());
      return;
    }

    httpAdapter.reply(
      res,
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        path,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
