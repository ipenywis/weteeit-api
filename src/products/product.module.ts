import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { productsProviders } from './product.providers';
import { ProductService } from './product.service';
import { ConfigModule } from '../config/config.module';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [ConfigModule, PaginationModule],
  providers: [ProductResolver, ...productsProviders, ProductService],
  exports: [ProductService, ...productsProviders],
})
export class ProductModule {}
