import { Module } from '@nestjs/common';
import { shippingsProviders } from './shipping.providers';
import { ShippingResolver } from './shipping.resolver';
import { ShippingService } from './shipping.service';

@Module({
  providers: [ShippingResolver, ...shippingsProviders, ShippingService],
})
export class ShippingModule {}
