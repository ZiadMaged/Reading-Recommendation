import { GenericRepository } from 'src/shared/generics/repositories/generic.repository';
import { Labels } from '../entities/users.entity';
import { ResponseLabelDto, LabelsPagination } from '../utils/dto/labels.dto';

export class UsersRepository extends GenericRepository<
  Labels,
  ResponseLabelDto,
  LabelsPagination
> {
  constructor() {
    super(Labels);
  }
}
