import { ValidationError } from 'class-validator';
import {
  AppError,
  AppErrorCodes,
  AppErrorStatus,
  getErrorMsg,
} from './AppError';

function handleException(errors: ValidationError[]) {
  try {
    let appCode: AppErrorCodes = AppErrorCodes.BAD_REQUEST;
    let appStatus: AppErrorStatus = AppErrorStatus.BAD_REQUEST;

    const errorConstraints: { [type: string]: string }[] =
      getChilderenConstraints(errors);
    const errorKeys: string[] = errorConstraints.map((e) => Object.keys(e)[0]);
    const errorValues: string = errorConstraints
      .map((e) => Object.values(e)[0])
      .toString();

    if (errorKeys.every((x) => ['Exists', 'DoesntExists'].includes(x))) {
      appCode = AppErrorCodes.VALIDATION_ERROR;
      appStatus = AppErrorStatus.UNPROCESSABLE_ENTITY;
    }

    return new AppError(errorValues, appCode, appStatus);
  } catch (err) {
    return new AppError(
      `Exception Factory, ${getErrorMsg(err)}`,
      AppErrorCodes.INTERNAL_SERVER_ERROR,
      AppErrorStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

function getChilderenConstraints(errors: ValidationError[]) {
  const errorConstraints: { [type: string]: string }[] = [];

  function extractConstaints(error: ValidationError) {
    if (error.constraints) errorConstraints.push(error.constraints);
    else if (error.children.length > 0) {
      for (const child of error.children) extractConstaints(child);
    }
  }

  for (const error of errors) extractConstaints(error);

  return errorConstraints;
}

export default handleException;
