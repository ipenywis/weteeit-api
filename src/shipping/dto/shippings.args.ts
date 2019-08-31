import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class ShippingArgs {
  @Field({ nullable: false })
  wilaya: string;
}
