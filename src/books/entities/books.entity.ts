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
} from 'sequelize-typescript';
import { RoleType } from 'src/shared/enums/roles.enum';

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
