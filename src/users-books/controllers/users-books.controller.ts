import {
  Body,
  Controller,
  Param,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Put,
} from '@nestjs/common';
import { UsersBooksService } from '../services/users-books.service';
import { BooksInterceptor } from '../utils/interceptor/users-books.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/validators/auth.guard';
import { UserSchema } from 'src/users/utils/users.dto';
import { ResponseBookProgressDto, ResponseRecommendationBookDto, UpdateBookProgressDto } from '../utils/users-books.dto';
import { ParamBookDto } from 'src/books/utils/books.dto';

@Controller('books')
export class UsersBooksController {
  constructor(private usersBooksService: UsersBooksService) {}
  
  @Get('recommendations')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    new BooksInterceptor<ResponseRecommendationBookDto>(ResponseRecommendationBookDto),
  )
  async getRecommendBooks(): Promise<ResponseRecommendationBookDto[]> {
    return await this.usersBooksService.getRecommendationBooks();
  }

  @Put(':bookId/progress')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    new BooksInterceptor<ResponseBookProgressDto>(ResponseBookProgressDto),
  )
  async updateProgress(
    @Param() params: ParamBookDto,
    @Body() dto: UpdateBookProgressDto,
    @Request() { user }: { user: UserSchema },
  ): Promise<ResponseBookProgressDto> {
    dto = {
      bookId: params.bookId,
      userId: user.id,
      startPage: dto.start_page,
      endPage: dto.end_page,
    };

    return await this.usersBooksService.addBookProgress(dto);
  }

}
