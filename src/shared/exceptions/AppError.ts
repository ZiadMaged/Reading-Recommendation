import { HttpException, HttpStatus } from '@nestjs/common';

import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AppErrorCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  URL_NOT_FOUND = 'URL_NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  NOT_FOUND = 'NOT_FOUND',
}

export enum AppErrorStatus {
  BAD_REQUEST = HttpStatus.BAD_REQUEST, // Syntax of the request is wrong

  UNAUTHORIZED = HttpStatus.UNAUTHORIZED, // Not Authorized

  // Client not permitted access to the resource despite providing authentication such as insufficient permissions of the authenticated account
  // The server understood the request, but is refusing to authorize it.
  // You don't have permission to access /securedpage on this server
  INSUFFICIENT_PERMISSIONS = HttpStatus.FORBIDDEN,

  NOT_FOUND = HttpStatus.NOT_FOUND, // Wrong URL

  // Request is well-formed but the server is unable to process it
  // because it contains semantic errors or does not meet certain conditions
  // Or Resource doesn't exists
  UNPROCESSABLE_ENTITY = HttpStatus.UNPROCESSABLE_ENTITY,

  INTERNAL_SERVER_ERROR = HttpStatus.INTERNAL_SERVER_ERROR, // Server Errors
}

export class AppError extends HttpException {
  @ApiPropertyOptional({
    description: 'The HTTP status code',
    enum: Object.values(AppErrorStatus),
  })
  statusCode: number;

  @ApiPropertyOptional({
    description: 'The error message',
    type: String,
    example: 'Bad Request',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'The application error code',
    enum: Object.values(AppErrorCodes),
  })
  appCode: AppErrorCodes;

  @ApiPropertyOptional({
    description: 'The request path',
    type: String,
  })
  path?: string;

  constructor(message: string, appCode: AppErrorCodes, status: AppErrorStatus) {
    super(message, status);

    this.message = message;
    this.appCode = appCode;
    this.statusCode = status;
  }
}

export function getErrorMsg(err): string {
  return err?.original?.message || err?.message;
}
