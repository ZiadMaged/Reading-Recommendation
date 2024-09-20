import {
  Table,
  Column,
  Model,
  Sequelize,
  PrimaryKey,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AutoIncrement,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Books } from 'src/books/entities/books.entity';
import { RoleType } from 'src/shared/enums/roles.enum';
import { UsersBooks } from 'src/users-books/entities/users-books.entity';

@Table({
  tableName: 'Users',
  paranoid: true,
})
export class Users extends Model<Users> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  role: RoleType;

  @BelongsToMany(() => Books, () => UsersBooks)
  books: Books[];

  @CreatedAt
  @AllowNull(false)
  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}
