import { Expose } from 'class-transformer';

export class ResponseBookDto {
  @Expose()
  id?: number;

  @Expose()
  name?: string;

  @Expose()
  numPages?: number;
}

export class BooksPaginationDto {
  rows: ResponseBookDto[];
  count: number;
}