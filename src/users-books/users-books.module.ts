import { Module } from '@nestjs/common';
import { UsersBooksController } from './controllers/users-books.controller';
import { UsersBooksService } from './services/users-books.service';
import { UsersBooksRepository } from './repositories/users-books.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersBooks } from './entities/users-books.entity';
import { BooksModule } from 'src/books/books.module';

const PROVIDERS = [
  UsersBooksService,
  UsersBooksRepository
];

@Module({
  imports: [
    SequelizeModule.forFeature([UsersBooks]),
    BooksModule
  ],
  providers: [...PROVIDERS],
  controllers: [UsersBooksController],
  exports: [UsersBooksService],
})
export class UsersBooksModule { }
