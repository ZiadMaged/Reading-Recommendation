import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, Validate, ValidateNested } from 'class-validator';
import { Exists } from 'src/shared/validators/exists.validator';
import { TokenSchema, UserSchema } from './login-schema.dto';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @Validate(Exists, ['Users', 'email'])
  email?: string;

  @IsNotEmpty()
  @MinLength(8)
  password?: string;
}

export class LoginResponseDto {
  @Type(() => UserSchema)
  @ValidateNested({ each: true })
  @Expose()
  user: UserSchema;

  @Type(() => TokenSchema)
  @ValidateNested({ each: true })
  @Expose()
  backendTokens: TokenSchema;
}
