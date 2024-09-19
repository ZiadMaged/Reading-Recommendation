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
export class Exists implements ValidatorConstraintInterface {
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
          AppErrorCodes.VALIDATION_ERROR,
          AppErrorStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (!value) return false;

      const where = {
        [field]: value,
      };

      if (bypassValue) {
        where[bypassColumn] = bypassValue;
      }

      const entity = await modelInstance.findOne({ where });
      return !!entity;
    } catch (err) {
      throw new AppError(
        `Error while validating, ${getErrorMsg(err)}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} ${
      args.value ?? '$value'
    } doesn't exists, please try another one.`;
  }
}
