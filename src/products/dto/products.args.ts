import { ArgsType, Field, Int } from 'type-graphql';
import { Min } from 'class-validator';

@ArgsType()
export class ProductArgs {
  @Field()
  @Min(0)
  name?: string;
}
