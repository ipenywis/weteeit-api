import { Field, Int, ObjectType } from 'type-graphql';

import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'shipping' })
@ObjectType('shipping')
export class Shipping extends Model<Shipping> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  @Field(type => Int)
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  @Field()
  wilaya: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @Field(type => Int)
  price: number;
}
