import { IsInt, IsNotEmpty } from "class-validator";


export class CreateBookDto {
  @IsNotEmpty()
  name?: string;
  
  @IsNotEmpty()
  @IsInt()
  numPages?: number;
}