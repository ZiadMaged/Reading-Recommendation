import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getConfig } from './shared/configs/sequelize.config';
import { UsersModule } from './users/users.module';
import { ValidatorsModule } from './shared/validators/validators.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AuthGuard } from './shared/validators/auth.guard';
import { BooksModule } from './books/books.module';
import { UsersBooksModule } from './users-books/users-books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync(getConfig()),
    ValidatorsModule,
    UsersModule,
    UsersBooksModule,
    BooksModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ]
})
export class AppModule { }
