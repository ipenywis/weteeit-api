import { Field, Int, ClassType, ObjectType } from 'type-graphql';

export interface IPaginationMetadata {
  numPages: number;
  perPage: number;
  pageId: number;
  count: number;
}

@ObjectType('paginationMetaDataClass')
export class PaginationMetaDataClass {
  @Field(type => Int, { nullable: true })
  numPages?: number;

  @Field(type => Int, { nullable: true })
  perPage?: number;

  @Field(type => Int, { nullable: true })
  pageId?: number;

  @Field(type => Int, { nullable: true })
  count?: number;
}

/*
TODO: Moving from Generic to Explecit 
export function WithPagination<T>(TClass: ClassType<T>): any {
  //const className = TClass instanceof Array ? TClass[0].name : TClass.name;
  @ObjectType(`withPagination-${TClass.name}`, { isAbstract: true })
  abstract class WithPaginationClass {
    @Field(type => TClass)
    data: T;

    @Field(type => PaginationMetaDataClass)
    pagination: IPaginationMetadata;
  }

  return WithPaginationClass;
}
*/
