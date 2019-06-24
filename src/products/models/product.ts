import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Table,
  Model,
  DataType,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { ProductTypes } from '../types';
import { Order } from '../../orders/models/order';

@Table({ tableName: 'products' })
@ObjectType()
export class Product extends Model<Product> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  @Field(type => Int)
  id: number;

  @Column({
    allowNull: false,
    unique: true,
  })
  @Field()
  name: string;

  @Column({ allowNull: false })
  @Field(type => String)
  type: ProductTypes;

  @Default(true)
  @Column({ allowNull: false })
  @Field()
  available: boolean;

  @Column({ allowNull: false })
  @Field(type => Int)
  price: number;

  @Column({ allowNull: false })
  @Field()
  imageUrl: string;

  @HasMany(of => Order)
  orders: Order[];
}
