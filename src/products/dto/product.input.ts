import { IsIn } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ProductTypes } from '../types';

const productTypes = Object.values(ProductTypes).map((type: string) =>
  type.toLowerCase(),
);

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @IsIn(productTypes)
  @Field()
  type: string;

  @Field({ nullable: true })
  available?: boolean;

  @Field(type => Int)
  price: number;

  @Field()
  imageUrl: string;
}
