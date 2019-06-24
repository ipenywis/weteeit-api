import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
} from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';
import { Product } from '../../products/models/product';

@Table({ tableName: 'orders' })
@ObjectType()
export class Order extends Model<Order> {
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
  transactionId: string;

  @Column({ allowNull: false })
  @Field()
  email: string;

  @Column({ allowNull: false })
  @Field()
  phone: string;

  @Column({ allowNull: true })
  @Field({ nullable: true })
  facebook_profile?: string;

  @Column({ allowNull: false })
  @Field()
  firstName: string;

  @Column({ allowNull: false })
  @Field()
  lastName: string;

  @Column({ allowNull: false })
  @Field()
  address: string;

  @Column({ allowNull: false })
  @Field()
  wilaya: string;

  @Column({ allowNull: false })
  @Field()
  city: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @Field(type => Int)
  quantity: number;

  @Column
  @ForeignKey(of => Product)
  productId: number;
}
