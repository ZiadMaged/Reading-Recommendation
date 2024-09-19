import { Global, Module } from '@nestjs/common';
import { Exists } from './exists.validator';
import { DoesntExists } from './doesnt-exist.validator';
import { JwtService } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { AuthGuard } from 'src/shared/validators/auth.guard';

const PROVIDERS = [
  Exists, 
  DoesntExists, 
  JwtService,
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
];

@Global()
@Module({
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class ValidatorsModule {}
