import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { Exists } from 'src/shared/validators/exists.validator';

export class ParamBookDto {
  @ApiProperty({
    description: 'ID for the love game',
    example: 1,
  })
  @IsNotEmpty()
  @Validate(Exists, ['Books', 'id'])
  bookId: number;
}
