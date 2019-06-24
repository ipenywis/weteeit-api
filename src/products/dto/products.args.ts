import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class ProductArgs {
  @Field()
  name?: string;
}
