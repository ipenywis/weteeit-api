import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';
import { GqlAuthGuard } from '../guards/admin.guard';
import { ProductInput } from './dto/product.input';
import { Product } from './models/product';
import { ProductService } from './product.service';
import { ProductsWithPagination } from './types';

@Resolver(of => Product)
export class ProductResolver {
  constructor(private readonly productsService: ProductService) {}

  @Query(returns => [Product], { name: 'products' })
  async getProducts() {
    return await this.productsService.findAll().catch(err => {
      throw err;
    });
  }

  @Query(returns => ProductsWithPagination, { name: 'productsByType' })
  async getProductsByType(
    @Args('type') type: string,
    @Args({ name: 'pageId', nullable: true, type: () => Int }) pageId?: number,
    @Args({ name: 'limitPerPage', nullable: true, type: () => Int })
    limitPerPage?: number,
  ) {
    return await this.productsService
      .findByType(type, pageId, limitPerPage)
      .catch(err => {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Product)
  async storeProduct(
    @Args('newProductData') newProductData: ProductInput,
  ): Promise<Product> {
    const product = await this.productsService
      .insertProduct(newProductData)
      .catch(err => {
        throw err;
      });
    return product;
  }

  @Query(returns => Boolean, { name: 'productExists' })
  async productExists(@Args('name') name: string): Promise<boolean> {
    const exists = await this.productsService.productExists(name).catch(err => {
      throw err;
    });
    return exists;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean, { name: 'deleteProduct' })
  async deleteProduct(@Args('name') name: string): Promise<boolean> {
    const isProductDeleted = await this.productsService
      .deleteProduct(name)
      .catch(err => {
        throw err;
      });
    return isProductDeleted;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Product, { name: 'updateProduct' })
  async updateProduct(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updatedProductData') updatedProductData: ProductInput,
  ) {
    const updatedProduct = await this.productsService
      .updateProduct(id, updatedProductData)
      .catch(err => {
        throw err;
      });
    return updatedProduct;
  }
}
