import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';
import { Order } from '../../orders/models/order';
import { OrderProduct } from '../../orders/models/orderProduct';
import { ProductTypes } from '../types';

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

  @Column({ type: DataType.STRING, unique: true })
  @Field({ nullable: true })
  key: string;

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

  @BelongsToMany(() => Order, () => OrderProduct)
  orders: Order[];

  @Field(() => [OrderProduct], { nullable: true })
  orderProduct: OrderProduct[];
}
