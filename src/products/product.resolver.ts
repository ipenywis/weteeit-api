import { Resolver, Query, Args } from '@nestjs/graphql';
import { Product } from './models/product';
import { ProductArgs } from './dto/products.args';
import { ProductTypes } from './types';

@Resolver(of => Product)
export class ProductResolver {
  constructor() {}

  @Query(returns => Product, { name: 'product' })
  getProducts(@Args() args: ProductArgs) {
    console.log('Args: ', args);
    let newProduct = new Product();
    newProduct = {
      id: 1,
      name: 'bad tshirt',
      type: ProductTypes.TSHIRT,
      available: true,
    };
    return newProduct;
  }
}
