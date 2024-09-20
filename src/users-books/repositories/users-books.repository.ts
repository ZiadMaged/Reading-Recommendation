import { UsersBooks } from '../entities/users-books.entity';
import { ModelCtor } from 'sequelize-typescript';
import { CreateOptionsType, DestroyOptionsType, FindAndCountOptionsType, FindOptionsType, UpdateOptionWithReturnType } from 'src/shared/types/repository.type';
import { AppError, AppErrorCodes, AppErrorStatus, getErrorMsg } from 'src/shared/exceptions/AppError';
import { ResponseUserBookDto, UpdateBookProgressDto, UsersBooksPaginationDto } from '../utils/users-books.dto';

export class UsersBooksRepository {
  constructor(protected repository: ModelCtor<UsersBooks>) {
    this.repository = UsersBooks;
  }

  async getAll(options?: FindAndCountOptionsType<UsersBooks>): Promise<UsersBooksPaginationDto> {
    try {
      const rows: UsersBooks[] =
        await this.repository.findAll(options);

      const result: ResponseUserBookDto[] = this.transformResultArray(rows);

      return { rows: result, count: 0 };
    } catch (err) {
      throw new AppError(
        `Error while getting all records, ${getErrorMsg(err)}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  
  async get(id?: number, options?: FindOptionsType<UsersBooks>): Promise<ResponseUserBookDto> {
    try {
      let modelResult: UsersBooks;

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
    item: UpdateBookProgressDto,
    options?: CreateOptionsType<UsersBooks>,
  ): Promise<ResponseUserBookDto> {
    try {
      const modelResult: UsersBooks = await this.repository.create(item, options);

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
    item: UpdateBookProgressDto,
    options: UpdateOptionWithReturnType<UsersBooks>,
  ): Promise<ResponseUserBookDto> {
    try {
      type UpdateType = [affectedCount: number, affectedRows: UsersBooks[]];

      const result: UpdateType = await this.repository.update(item, options);

      if (result[1].length > 1) {
        const resp: ResponseUserBookDto[] = [];

        for (const arr of result[1]) {
          resp.push(this.transformResult(arr));
        }

        return resp as ResponseUserBookDto;
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

  async delete(options: DestroyOptionsType<UsersBooks>): Promise<void> {
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

  private transformResultArray(
    modelResult: UsersBooks | UsersBooks[],
    arr: ResponseUserBookDto[] = [],
    index: number = 0,
  ): ResponseUserBookDto[] {
    if (Array.isArray(modelResult)) {
      const arrLength = modelResult.length;
      for (let i = 0; i < arrLength; ++i)
        this.transformResultArray(modelResult[i], arr, i);
    } else arr[index] = this.transformModel(modelResult);

    return arr;
  }

  private transformResult(modelResult: UsersBooks): any {
    return this.transformModel(modelResult);
  }

  private transformModel(modelResult: UsersBooks): any {
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
