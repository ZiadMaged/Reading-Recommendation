import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './entities/users.entity';
import { UsersInterceptor } from './utils/interceptor/users.interceptor';
import { ValidatorsModule } from 'src/shared/validators/validators.module';

const PROVIDERS = [
  UsersService,
  UsersRepository
];

@Module({
  imports: [
    SequelizeModule.forFeature([Users])
  ],
  providers: [...PROVIDERS],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
