import { Observable } from 'rxjs';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { performIntercept } from 'src/shared/utils';
import { ClassConstructor } from 'class-transformer';

@Injectable()
export class UsersInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return performIntercept(handler, this.dto);
  }
}
