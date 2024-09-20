import { Expose } from 'class-transformer';
import { ResponseBookDto } from 'src/books/utils/books.dto';

export class ResponseRecommendationBookDto {
  @Expose()
  book_id?: number;

  @Expose()
  book_name?: string;

  @Expose()
  num_of_pages?: number;

  @Expose()
  num_of_read_pages?: number;
}

export class ResponseUserBookDto {
  userId?: number;
  bookId?: number;
  startPage?: number;
  endPage?: number;
  maxStartPage?: number;
  maxEndPage?: number;
  book?: ResponseBookDto;
}

export class UsersBooksPaginationDto {
  rows: ResponseUserBookDto[];
  count: number;
}