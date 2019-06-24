import { Module } from '@nestjs/common';
import { ordersProviders } from './order.providers';
import { OrderSerivce } from './order.service';
import { OrderResolver } from './order.resolver';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [ProductModule],
  providers: [OrderResolver, ...ordersProviders, OrderSerivce],
})
export class OrderModule {}
