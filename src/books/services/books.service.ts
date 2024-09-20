import { Injectable } from '@nestjs/common';
import { BooksRepository } from '../repositories/books.repository';
import { BooksPaginationDto, CreateBookDto, ResponseBookDto, UpdateBookDto } from '../utils/books.dto';
import { UpdateOptionWithReturnType } from 'src/shared/types/repository.type';
import { Books } from '../entities/books.entity';

@Injectable()
export class BooksService {
  constructor(
    protected readonly booksRepository: BooksRepository
  ) { }
  
  async getAll(): Promise<ResponseBookDto[]> {
    const {rows}: BooksPaginationDto= await this.booksRepository.getAll();
    
    return rows;
  }

  async getById(id: number): Promise<ResponseBookDto> {
    return await this.booksRepository.get(id);
  }

  async create(payload: CreateBookDto): Promise<ResponseBookDto> {
    return await this.booksRepository.create(payload);
  }

  async update(id: number, payload: UpdateBookDto): Promise<ResponseBookDto> {
    if(!Object.keys(payload).length)
      return await this.getById(id);

    const options: UpdateOptionWithReturnType<Books> = {
      returning: true,
      where: { id },
    }

    return await this.booksRepository.update(payload, options);
  }
}
