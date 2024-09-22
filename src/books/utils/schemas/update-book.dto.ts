import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  numPages?: number;
}
