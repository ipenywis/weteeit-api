import { Field, Int, ClassType, ObjectType } from 'type-graphql';

export interface IPaginationMetadata {
  numPages: number;
  perPage: number;
  pageId: number;
}

@ObjectType('paginationMetaDataClass')
export class PaginationMetaDataClass {
  @Field(type => Int)
  numPages: number;

  @Field(type => Int)
  perPage: number;

  @Field(type => Int)
  pageId: number;
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
