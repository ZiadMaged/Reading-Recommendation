import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numPages?: number;
}
