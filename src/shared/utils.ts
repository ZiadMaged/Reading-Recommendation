import { CallHandler } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Observable, catchError, map } from 'rxjs';
import {
  AppError,
  AppErrorCodes,
  AppErrorStatus,
  getErrorMsg,
} from 'src/shared/exceptions/AppError';

function performIntercept(handler: CallHandler, dto: any): Observable<any> {
  return handler.handle().pipe(
    map(async (data: any) => await transformResponse(data, dto)),
    catchError((err) => {
      throw new AppError(
        `${getResponseError(err)}`,
        err.appCode || getAppCodeError(err),
        err.statusCode || getStatusCodeError(err),
      );
    }),
  );
}

function getAppCodeError(err): AppErrorCodes {
  if (!err.response) return AppErrorCodes.INTERNAL_SERVER_ERROR;

  let hasExists: boolean = false;

  if (Array.isArray(err?.response?.message))
    hasExists = err?.response?.message.every((r) => r.includes('exists'));

  return hasExists ? AppErrorCodes.VALIDATION_ERROR : AppErrorCodes.BAD_REQUEST;
}

function getStatusCodeError(err): AppErrorStatus {
  if (!err.response) return AppErrorStatus.INTERNAL_SERVER_ERROR;

  let hasExists: boolean = false;

  if (Array.isArray(err?.response?.message))
    hasExists = err?.response?.message.every((r) => r.includes('exists'));

  return hasExists
    ? AppErrorStatus.UNPROCESSABLE_ENTITY
    : AppErrorStatus.BAD_REQUEST;
}

async function transformResponse(data: any, dto: any): Promise<any> {
  try {
    let responseBody: any = {};

    if (!data) return responseBody;

    responseBody = plainToInstance(dto, data, {
      strategy: 'excludeAll',
    });

    if (Object.keys(data).length < 1) return responseBody;

    const errors = await validate(responseBody);

    if (errors.length > 0)
      throw new AppError(
        `${errors}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );

    return responseBody;
  } catch (err) {
    throw new AppError(
      `Error while transforming response, ${getErrorMsg(err)}`,
      AppErrorCodes.INTERNAL_SERVER_ERROR,
      AppErrorStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

function getResponseError(err: any) {
  return err?.response?.message || err?.response || err?.message;
}

export { performIntercept, transformResponse, getResponseError };
