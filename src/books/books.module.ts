import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';
import { BooksRepository } from './repositories/books.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Books } from './entities/books.entity';

const PROVIDERS = [
  BooksService,
  BooksRepository
];

@Module({
  imports: [
    SequelizeModule.forFeature([Books])
  ],
  providers: [...PROVIDERS],
  controllers: [BooksController],
  exports: [BooksService],
})
export class BooksModule { }
