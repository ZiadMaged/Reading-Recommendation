import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { BooksInterceptor } from '../utils/interceptor/books.interceptor';
import { RoleType } from 'src/shared/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/validators/auth.guard';
import { CreateBookDto, ParamBookDto, ResponseBookDto, UpdateBookDto } from '../utils/books.dto';
import { UserSchema } from 'src/users/utils/users.dto';
import { AppError, AppErrorCodes, AppErrorStatus } from 'src/shared/exceptions/AppError';

@Controller('books')
@UseInterceptors(
  new BooksInterceptor<ResponseBookDto>(ResponseBookDto),
)
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateBookDto,
    @Request() { user }: { user: UserSchema },
  ): Promise<ResponseBookDto> {
    this.validateRole(user.role);

    return await this.booksService.create(dto);
  }

  @Patch(':bookId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async update(
    @Param() params: ParamBookDto,
    @Body() dto: UpdateBookDto,
    @Request() { user }: { user: UserSchema },
  ): Promise<ResponseBookDto> {
    this.validateRole(user.role);

    return await this.booksService.update(params.bookId, dto);
  }

  @Get(':bookId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getBookById(
    @Param() params: ParamBookDto,
    @Request() { user }: { user: UserSchema },
  ): Promise<ResponseBookDto> {
    this.validateRole(user.role);

    return await this.booksService.getById(params.bookId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getAllBooks(
    @Request() { user }: { user: UserSchema },
  ): Promise<ResponseBookDto[]> {
    this.validateRole(user.role);

    return await this.booksService.getAll();
  }
  
  private validateRole(role: RoleType): void {
    if(role !== RoleType.Admin)
      throw new AppError(
        'Only Admins can access this endpoint',
        AppErrorCodes.INSUFFICIENT_PERMISSIONS,
        AppErrorStatus.INSUFFICIENT_PERMISSIONS
      );
  }
}
