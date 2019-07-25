import { Field, ObjectType } from 'type-graphql';
import { Product } from './models/product';
import { PaginationMetaDataClass } from '../typings/types';

export enum ProductTypes {
  TSHIRT = 'TSHIRT',
  HOODIE = 'HOODIE',
  SWEATSHIRT = 'SWEATSHIRT',
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
