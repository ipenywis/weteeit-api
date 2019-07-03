import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Product } from './models/product';
import { ProductArgs } from './dto/products.args';
import { ProductService } from './product.service';
import { NewProductInput } from './dto/new-product.input';

@Resolver(of => Product)
export class ProductResolver {
  constructor(private readonly productsService: ProductService) {}

  @Query(returns => [Product], { name: 'products' })
  async getProducts() {
    return await this.productsService.findAll().catch(err => {
      throw err;
    });
  }

  @Query(returns => Product, { name: 'productByName' })
  async getProductByName(@Args('name') name: string) {
    const product = await this.productsService
      .findOneByName(name)
      .catch(err => {
        throw err;
      });
    return product;
  }

  @Query(returns => Product, { name: 'productById' })
  async getProductById(@Args('id') id: string) {
    const product = await this.productsService.findOneById(id).catch(err => {
      throw err;
    });
    return product;
  }

  @Mutation(returns => Product)
  async storeProduct(
    @Args('newProductData') newProductData: NewProductInput,
  ): Promise<Product> {
    console.log('Inserting new Product');
    const product = await this.productsService
      .insertProduct(newProductData)
      .catch(err => {
        throw err;
      });
    return product;
  }
}
