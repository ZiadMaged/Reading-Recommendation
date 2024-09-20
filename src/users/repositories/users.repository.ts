import { Users } from '../entities/users.entity';
import { ModelCtor } from 'sequelize-typescript';
import { CreateOptionsType, CreateType, DestroyOptionsType, FindOptionsType, UpdateOptionWithReturnType } from 'src/shared/types/repository.type';
import { UserSchema } from '../utils/users.dto';
import { AppError, AppErrorCodes, AppErrorStatus, getErrorMsg } from 'src/shared/exceptions/AppError';

export class UsersRepository {
  constructor(protected repository: ModelCtor<Users>) {
    this.repository = Users;
  }

  async get(id?: number, options?: FindOptionsType<Users>): Promise<UserSchema> {
    try {
      let modelResult: Users;

      if (id || id === 0)
        modelResult = await this.repository.findByPk(id, options);
      else modelResult = await this.repository.findOne(options);

      return this.transformResult(modelResult);
    } catch (err) {
      throw new AppError(
        `Error while getting a record, ${getErrorMsg(err)}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async create(
    item: CreateType<Users>,
    options?: CreateOptionsType<Users>,
  ): Promise<UserSchema> {
    try {
      const modelResult: Users = await this.repository.create(item, options);

      return this.transformResult(modelResult);
    } catch (err) {
      throw new AppError(
        `Error while creating, ${getErrorMsg(err)}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async update(
    item: any,
    options: UpdateOptionWithReturnType<Users>,
  ): Promise<UserSchema> {
    try {
      type UpdateType = [affectedCount: number, affectedRows: Users[]];

      const result: UpdateType = await this.repository.update(item, options);

      if (result[1].length > 1) {
        const resp: UserSchema[] = [];

        for (const arr of result[1]) {
          resp.push(this.transformResult(arr));
        }

        return resp as UserSchema;
      } else 
        return this.transformResult(result[1][0]);
      
    } catch (err) {
      throw new AppError(
        `Error while updating, ${getErrorMsg(err)}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async delete(options: DestroyOptionsType<Users>): Promise<void> {
    try {
      await this.repository.destroy(options);
    } catch (err) {
      throw new AppError(
        `Error while deleting, ${getErrorMsg(err)}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }


  private transformResult(modelResult: Users): any {
    return this.transformModel(modelResult);
  }

  private transformModel(modelResult: Users): any {
    if (!modelResult) return null;

    const result: any = Object.entries(modelResult?.dataValues ?? modelResult);

    for (let i = 0; i < result.length; i++) {
      const [_, value] = result[i];

      if (Array.isArray(value))
        result[i][1] = value.map((record) => {
          if (typeof record === 'object') return this.transformModel(record);
          else return record.dataValues;
        });
      else if (value && !(value instanceof Date) && typeof value === 'object')
        result[i][1] = this.transformModel(value);
    }

    return Object.fromEntries(result);
  }
  
}
