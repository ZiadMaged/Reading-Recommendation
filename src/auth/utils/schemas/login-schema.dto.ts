import { Expose } from "class-transformer";
import { RoleType } from "src/shared/enums/roles.enum";


export class UserSchema {
  @Expose()
  id?: number;

  @Expose()
  name?: string;
  
  @Expose()
  email?: string;
  
  @Expose()
  role?: RoleType;

  password?: string;
}

export class TokenSchema {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  expiresIn: number;
}