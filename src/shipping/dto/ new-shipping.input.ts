import { Field, Int, InputType } from 'type-graphql';

@InputType()
export class NewShippingInput {
  @Field({ nullable: false })
  wilaya: string;

  @Field(type => Int, { nullable: false })
  price: number;
}
