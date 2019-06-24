import { Field, Int, InputType } from 'type-graphql';
import { IsIn } from 'class-validator';
import { ProductTypes } from '../types';

const productTypes = Object.values(ProductTypes).map((type: string) =>
  type.toLowerCase(),
);

@InputType()
export class NewProductInput {
  @Field()
  name: string;

  @IsIn(productTypes)
  @Field()
  type: string;

  @Field()
  available?: boolean;

  @Field(type => Int)
  price: number;

  @Field()
  imageUrl: string;
}
