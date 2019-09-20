import { Column, Table, Model, DataType } from 'sequelize-typescript';
import { ObjectType, Field } from 'type-graphql';

@Table({ tableName: 'admins' })
@ObjectType()
export class Admin extends Model<Admin> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  @Field()
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  @Field()
  email: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  @Field()
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
}
