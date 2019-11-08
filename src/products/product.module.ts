import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { PaginationModule } from '../pagination/pagination.module';
import { productsProviders } from './product.providers';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [ConfigModule, PaginationModule, AuthModule],
  providers: [ProductResolver, ...productsProviders, ProductService],
  exports: [ProductService, ...productsProviders],
})
export class ProductModule {}
