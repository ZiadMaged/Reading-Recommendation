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
