import { Injectable } from '@nestjs/common';
import { UsersBooksRepository } from '../repositories/users-books.repository';
import { UpdateOptionWithReturnType } from 'src/shared/types/repository.type';
import { UsersBooks } from '../entities/users-books.entity';
import {
  ResponseBookProgressDto,
  ResponseRecommendationBookDto,
  ResponseUserBookDto,
  UpdateBookProgressDto,
  UsersBooksPaginationDto,
} from '../utils/users-books.dto';
import { StatusCodeType } from 'src/shared/enums/status-code.enum';
import {
  AppError,
  AppErrorCodes,
  AppErrorStatus,
} from 'src/shared/exceptions/AppError';
import { BooksRepository } from 'src/books/repositories/books.repository';
import { ResponseBookDto } from 'src/books/utils/books.dto';
import { col, fn } from 'sequelize';
import { Books } from 'src/books/entities/books.entity';

@Injectable()
export class UsersBooksService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly usersBooksRepository: UsersBooksRepository,
  ) {}

  async getRecommendationBooks(): Promise<ResponseRecommendationBookDto[]> {
    const { rows }: UsersBooksPaginationDto =
      await this.usersBooksRepository.getAll({
        attributes: [
          'bookId',
          [fn('min', col('startPage')), 'maxStartPage'],
          [fn('max', col('endPage')), 'maxEndPage'],
        ],
        group: ['bookId', 'book.id'],
        include: [Books],
      });

    const response: ResponseRecommendationBookDto[] = rows
      .map((b) => ({
        book_id: b.bookId,
        book_name: b?.book?.name,
        num_of_pages: b?.book?.numPages,
        num_of_read_pages: b.maxEndPage - b.maxStartPage,
      }))
      ?.sort((a, b) => b.num_of_read_pages - a.num_of_read_pages);

    return response.length > 5 ? response.slice(0, 5) : response;
  }

  async addBookProgress(
    payload: UpdateBookProgressDto,
  ): Promise<ResponseBookProgressDto> {
    await this.validateIntervals(payload);

    const userBook: ResponseUserBookDto = await this.usersBooksRepository.get(
      null,
      {
        where: {
          userId: payload.userId,
          bookId: payload.bookId,
        },
      },
    );

    if (!userBook) {
      await this.usersBooksRepository.create(payload);
      return {
        status_code: StatusCodeType.success,
      };
    }

    if (payload.startPage >= userBook.startPage) delete payload.startPage;

    if (payload.endPage <= userBook.endPage) delete payload.endPage;

    if (payload.startPage || payload.endPage) {
      delete payload.userId;
      delete payload.bookId;
    }

    const options: UpdateOptionWithReturnType<UsersBooks> = {
      returning: true,
      where: {
        userId: userBook.userId,
        bookId: userBook.bookId,
      },
    };

    await this.usersBooksRepository.update(payload, options);

    return {
      status_code: StatusCodeType.success,
    };
  }

  public async validateIntervals(payload: UpdateBookProgressDto) {
    if (payload.startPage > payload.endPage)
      throw new AppError(
        'Start Page should be smaller than End Page',
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );

    const book: ResponseBookDto = await this.booksRepository.get(
      payload.bookId,
    );

    if (payload.endPage > book.numPages)
      throw new AppError(
        'End Page exceeds the max number of pages for this book',
        AppErrorCodes.VALIDATION_ERROR,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );
  }
}
