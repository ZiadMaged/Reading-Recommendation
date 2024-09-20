import {
  AppError,
  AppErrorCodes,
  AppErrorStatus,
  getErrorMsg,
} from 'src/shared/exceptions/AppError';
import { Injectable } from '@nestjs/common';

import { compare, hash } from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto, TokenSchema, UserSchema } from '../utils/users.dto';
import { UsersRepository } from '../repositories/users.repository';

const EXPIRE_TIME = 60 * 60 * 24;

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService<NodeJS.ProcessEnv>,
    protected readonly userRepository: UsersRepository
  ) { }

  async register(payload: RegisterRequestDto): Promise<RegisterResponseDto> {
    payload.password = await hash(payload.password, 10);

    return await this.userRepository.create(payload);
  }

  async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
    const user: UserSchema = await this.validateUser(payload);
    const backendTokens: TokenSchema = await this.getNewTokens(user);

    return {
      user,
      backendTokens,
    };
  }

  private async validateUser(payload: LoginRequestDto): Promise<UserSchema> {
    const user: UserSchema = await this.userRepository.get(null, {
      where: { email: payload.email },
    });

    if (!user)
      throw new AppError(
        `Email ${payload.email} doesn't exists, please try another one.`,
        AppErrorCodes.NOT_FOUND,
        AppErrorStatus.UNPROCESSABLE_ENTITY,
      );

    const isSamePassword: boolean = await this.isAuthorized(user, payload);
    if (!isSamePassword)
      throw new AppError(
        `Invalid Password`,
        AppErrorCodes.UNAUTHORIZED,
        AppErrorStatus.UNAUTHORIZED,
      );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  private async getNewTokens(user: UserSchema): Promise<TokenSchema> {
    try {
      delete user['exp'];
      delete user['iat'];
      return {
        accessToken: await this.jwtService.signAsync(user, {
          expiresIn: '1d',
          secret: this.configService.get<string>('JWT_SECRET'),
        }),
        refreshToken: await this.jwtService.signAsync(user, {
          expiresIn: '7d',
          secret: this.configService.get<string>('JWT_SECRET'),
        }),
        expiresIn: new Date().setTime(
          new Date().getTime() + EXPIRE_TIME * 1000,
        ),
      };
    } catch (e) {
      throw new AppError(
        `Error while generating tokens, ${getErrorMsg(e)}`,
        AppErrorCodes.INTERNAL_SERVER_ERROR,
        AppErrorStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async isAuthorized(
    user: UserSchema,
    payload: LoginRequestDto,
  ): Promise<boolean> {
    return user && (await compare(payload.password, user.password));
  }

  async refreshToken(user: UserSchema): Promise<LoginResponseDto> {
    const backendTokens: TokenSchema = await this.getNewTokens(user);

    return {
      user,
      backendTokens,
    };
  }
}
