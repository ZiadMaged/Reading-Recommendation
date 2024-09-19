import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Sequelize } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import {
  AppError,
  AppErrorCodes,
  AppErrorStatus,
  getErrorMsg,
} from '../exceptions/AppError';

@ValidatorConstraint({ async: true })
@Injectable()
export class DoesntExists implements ValidatorConstraintInterface {
  constructor(private readonly sequelize: Sequelize) {}

  async validate(value: any, args: ValidationArguments) {
    try {
      // eslint-disable-next-line
      let [model, field, bypassValue, bypassColumn] = args.constraints;

      if (!bypassColumn) {
        bypassColumn = 'id';
      }

      if (!field) {
        field = args.property;
      }

      const modelInstance = this.sequelize.models[model];
      if (!modelInstance) {
        throw new AppError(
          `Model ${model} not found`,
          AppErrorCodes.NOT_FOUND,
          AppErrorStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const where = {
        [field]: value,
      };

      if (bypassValue) {
        where[bypassColumn] = bypassValue;
      }

      const entity = await modelInstance.findOne({ where });
      return !entity;
    } catch (err) {
      throw new AppError(
        `Error while validating, ${getErrorMsg(err)}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} ${args.value} already exists, please try another one.`;
  }
}
