import { Field, ObjectType } from 'type-graphql';
import { PaginationMetaDataClass } from '../typings/types';
import { Product } from './models/product';

export enum ProductTypes {
  TSHIRT = 'TSHIRT',
  HOODIE = 'HOODIE',
  SWEETSHIRT = 'SWEETSHIRT',
  Poster = 'POSTER',
  Mug = 'MUG',
  Pillows = 'PILLOWS',
}

@ObjectType('productWithPagination')
export class ProductsWithPagination {
  @Field(type => [Product])
  products: Product[];

  @Field(type => PaginationMetaDataClass, { nullable: true })
  pagination?: PaginationMetaDataClass;
}
