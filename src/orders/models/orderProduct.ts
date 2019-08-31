import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
} from 'sequelize-typescript';
import { Product } from '../../products/models/product';
import { Order } from './order';
import { ObjectType, Field, Int } from 'type-graphql';

@Table({ tableName: 'order_products' })
@ObjectType()
export class OrderProduct extends Model<OrderProduct> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  @Field(type => Int)
  product: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  @Field(type => Int)
  order: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @Field(type => Int)
  quantity: number;
}
