import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class ProductArgs {
  @Field()
  name?: string;
}

@ArgsType()
export class ProductsByTypeArgs {
  @Field()
  type: string;

  @Field(() => Int, { nullable: true })
  pageId?: number;

  @Field(() => Int, { nullable: true })
  limitPerPage?: number;
}
