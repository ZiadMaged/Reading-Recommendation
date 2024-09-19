import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getConfig } from './shared/configs/sequelize.config';
import { UsersModule } from './auth/users.module';
import { ValidatorsModule } from './shared/validators/validators.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync(getConfig()),
    ValidatorsModule,
    UsersModule,
  ]
})
export class AppModule { }
