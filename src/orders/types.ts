import { Field, Int, ObjectType } from 'type-graphql';
import { Product } from '../products/models/product';

@ObjectType()
export class ProductWithQuantity {
  @Field(type => Product)
  product: Product;

  @Field(type => Int)
  quantity: number;
}
