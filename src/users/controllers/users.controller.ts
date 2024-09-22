import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersInterceptor } from '../utils/interceptor/users.interceptor';
import { RoleType } from 'src/shared/enums/roles.enum';
import { RegisterRequestDto, RegisterResponseDto } from '../utils/users.dto';
import { LoginRequestDto, LoginResponseDto } from '../utils/schemas/login.dto';
import { PublicRoute } from 'src/shared/validators/auth.decorator';

@Controller()
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('login')
  @PublicRoute()
  @UseInterceptors(new UsersInterceptor<LoginResponseDto>(LoginResponseDto))
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.userService.login(dto);
  }

  @Post('register/admin')
  @PublicRoute()
  @UseInterceptors(
    new UsersInterceptor<RegisterResponseDto>(RegisterResponseDto),
  )
  async registerAdmin(
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    dto = {
      ...dto,
      role: RoleType.Admin,
    };

    return await this.userService.register(dto);
  }

  @Post('register/user')
  @PublicRoute()
  @UseInterceptors(
    new UsersInterceptor<RegisterResponseDto>(RegisterResponseDto),
  )
  async registerUser(
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    dto = {
      ...dto,
      role: RoleType.User,
    };

    return await this.userService.register(dto);
  }
}
