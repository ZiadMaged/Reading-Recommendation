import { IsInt, IsOptional } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsInt()
  numPages?: number;
}