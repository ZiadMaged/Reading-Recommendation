import { Books } from '../entities/books.entity';
import { ModelCtor } from 'sequelize-typescript';
import { CreateOptionsType, CreateType, DestroyOptionsType, FindAndCountOptionsType, FindOptionsType, UpdateOptionWithReturnType } from 'src/shared/types/repository.type';
import { AppError, AppErrorCodes, AppErrorStatus, getErrorMsg } from 'src/shared/exceptions/AppError';
import { BooksPaginationDto, CreateBookDto, ResponseBookDto, UpdateBookDto } from '../utils/books.dto';

export class BooksRepository {
  constructor(protected repository: ModelCtor<Books>) {
    this.repository = Books;
  }

  async getAll(options?: FindAndCountOptionsType<Books>): Promise<BooksPaginationDto> {
    try {
      const { rows, count }: { rows: Books[]; count: number } =
        await this.repository.findAndCountAll(options);

      const result: ResponseBookDto[] = this.transformResultArray(rows);

      return { rows: result, count };
    } catch (err) {
      throw new AppError(
        `Error while getting all records, ${getErrorMsg(err)}`,
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  
  async get(id?: number, options?: FindOptionsType<Books>): Promise<ResponseBookDto> {
    try {
      let modelResult: Books;

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
    item: CreateBookDto,
    options?: CreateOptionsType<Books>,
  ): Promise<ResponseBookDto> {
    try {
      const modelResult: Books = await this.repository.create(item, options);

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
    item: UpdateBookDto,
    options: UpdateOptionWithReturnType<Books>,
  ): Promise<ResponseBookDto> {
    try {
      type UpdateType = [affectedCount: number, affectedRows: Books[]];

      const result: UpdateType = await this.repository.update(item, options);

      if (result[1].length > 1) {
        const resp: ResponseBookDto[] = [];

        for (const arr of result[1]) {
          resp.push(this.transformResult(arr));
        }

        return resp as ResponseBookDto;
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

  async delete(options: DestroyOptionsType<Books>): Promise<void> {
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
    modelResult: Books | Books[],
    arr: ResponseBookDto[] = [],
    index: number = 0,
  ): ResponseBookDto[] {
    if (Array.isArray(modelResult)) {
      const arrLength = modelResult.length;
      for (let i = 0; i < arrLength; ++i)
        this.transformResultArray(modelResult[i], arr, i);
    } else arr[index] = this.transformModel(modelResult);

    return arr;
  }

  private transformResult(modelResult: Books): any {
    return this.transformModel(modelResult);
  }

  private transformModel(modelResult: Books): any {
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
