import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  AppError,
  AppErrorCodes,
  AppErrorStatus,
} from '../exceptions/AppError';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    let appCode = AppErrorCodes.URL_NOT_FOUND;
    try {
      status = exception.getStatus();

      if (status === AppErrorStatus.BAD_REQUEST)
        appCode = AppErrorCodes.BAD_REQUEST;
    } catch (e) {
      status = 500;
      appCode = AppErrorCodes.INTERNAL_SERVER_ERROR;
    }

    const error = {
      statusCode: status,
      appCode: exception instanceof AppError ? exception.appCode : appCode,
      message: exception.message,
      path: request.url,
    };

    response.status(status).json(error);
  }
}
