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
  BelongsToMany,
} from 'sequelize-typescript';
import { UsersBooks } from 'src/users-books/entities/users-books.entity';
import { Users } from 'src/users/entities/users.entity';

@Table({
  tableName: 'Books',
  paranoid: true,
})
export class Books extends Model<Books> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @Column
  numPages: number;

  @BelongsToMany(() => Users, () => UsersBooks)
  users: Users[];

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
