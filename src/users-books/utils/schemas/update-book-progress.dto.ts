import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";
import { StatusCodeType } from "src/shared/enums/status-code.enum";

export class UpdateBookProgressDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  start_page?: number;
  
  @IsNotEmpty()
  @IsInt()
  end_page?: number;

  userId?: number;
  bookId?: number;
  startPage?: number;
  endPage?: number;
}

export class ResponseBookProgressDto {
  @Expose()
  status_code?: StatusCodeType;
}