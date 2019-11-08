import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { shippingsProviders } from './shipping.providers';
import { ShippingResolver } from './shipping.resolver';
import { ShippingService } from './shipping.service';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [ShippingResolver, ...shippingsProviders, ShippingService],
})
export class ShippingModule {}
