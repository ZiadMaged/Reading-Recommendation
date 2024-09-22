import { Global, Module } from '@nestjs/common';
import { Exists } from './exists.validator';
import { DoesntExists } from './doesnt-exist.validator';
import { JwtService } from '@nestjs/jwt';

const PROVIDERS = [Exists, DoesntExists, JwtService];

@Global()
@Module({
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class ValidatorsModule {}
