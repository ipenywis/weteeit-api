import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { productsProviders } from './product.providers';
import { ProductService } from './product.service';

@Module({
  providers: [ProductResolver, ...productsProviders, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
