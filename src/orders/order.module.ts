import { Module } from '@nestjs/common';
import { ordersProviders } from './order.providers';
import { OrderSerivce } from './order.service';
import { OrderResolver } from './order.resolver';
import { ProductModule } from '../products/product.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ProductModule, AuthModule, ConfigModule],
  providers: [OrderResolver, ...ordersProviders, OrderSerivce],
})
export class OrderModule {}
