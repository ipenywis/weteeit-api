import { Field, Int, ObjectType } from 'type-graphql';
import { ProductTypes } from '../types';

@ObjectType()
export class Product {
  @Field(type => Int)
  id: number;

  @Field(type => String)
  name: string;

  @Field(type => String)
  type: ProductTypes;

  @Field(type => Boolean)
  available: boolean;
}
