import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { RoleType } from 'src/shared/enums/roles.enum';
import { DoesntExists } from 'src/shared/validators/doesnt-exist.validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(DoesntExists, ['Users', 'email'])
  email?: string;

  @IsNotEmpty()
  @MinLength(8)
  password?: string;

  role?: RoleType;
}

export class RegisterResponseDto {
  @Expose()
  id?: number;

  @Expose()
  name?: string;
  
  @Expose()
  email?: string;
  
  @Expose()
  role?: RoleType;
}
