import {
  AppError,
  AppErrorCodes,
  AppErrorStatus,
  getErrorMsg,
} from 'src/shared/exceptions/AppError';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService<NodeJS.ProcessEnv>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.getReflector(context, IS_PUBLIC_KEY);
    if (isPublicRoute) return true;

    const request = this.getRequest(context);

    const token = this.extractTokenFromHeader(request);
    if (!token)
      throw new AppError(
        'Missing Token',
        AppErrorCodes.UNAUTHORIZED,
        AppErrorStatus.UNAUTHORIZED,
      );

    try {
      request['user'] = await this.verifyToken(token);
    } catch (e) {
      throw new AppError(
        `${getErrorMsg(e)}`,
        AppErrorCodes.UNAUTHORIZED,
        AppErrorStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  private getReflector(context: ExecutionContext, field: string): any {
    return this.reflector.getAllAndOverride<boolean>(field, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getRequest(context: ExecutionContext): any {
    return context.switchToHttp().getRequest();
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(/\s+/) ?? [];

    const isMatch: RegExpMatchArray = type?.match(/^Bearer$/i);

    return isMatch ? token : '';
  }

  private async verifyToken(token: string): Promise<any> {
    const jwtSecretValue: string = this.configService.get<string>(JWT_SECRET);

    return await this.jwtService.verifyAsync(token, {
      secret: jwtSecretValue,
    });
  }
}
