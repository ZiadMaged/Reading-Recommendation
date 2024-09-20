import {
  Table,
  Column,
  Model,
  Sequelize,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Books } from 'src/books/entities/books.entity';
import { Users } from 'src/users/entities/users.entity';

@Table({
  tableName: 'Users_x_Books',
  paranoid: true,
})
export class UsersBooks extends Model<UsersBooks> {
  @ForeignKey(() => Users)
  @Column
  userId: number;

  @BelongsTo(() => Users, { onDelete: 'CASCADE' })
  user: Users;

  @ForeignKey(() => Books)
  @Column
  bookId: number;

  @BelongsTo(() => Books, { onDelete: 'CASCADE' })
  book: Books;

  @Column
  startPage: number;

  @Column
  endPage: number;

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
