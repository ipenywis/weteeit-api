import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Shipping } from './models/shipping';
import { ShippingService } from './shipping.service';
import { NewShippingInput } from './dto/ new-shipping.input';

@Resolver(of => Shipping)
export class ShippingResolver {
  constructor(private readonly shippingsService: ShippingService) {}

  @Query(returns => [Shipping], { name: 'shippings' })
  async getShippings() {
    return await this.shippingsService.findAll().catch(err => {
      throw err;
    });
  }

  @Query(returns => Shipping, { name: 'shipping' })
  async getShippingByWilaya(@Args('wilaya') wilaya: string) {
    return await this.shippingsService.findByWilaya(wilaya).catch(err => {
      throw err;
    });
  }

  //TODO: Make this protected route (AUTH)
  @Mutation(returns => Shipping, { name: 'storeShipping' })
  async storeShipping(
    @Args('newShippingInput') newShippingData: NewShippingInput,
  ) {
    return await this.shippingsService
      .insertShipping(newShippingData)
      .catch(err => {
        throw err;
      });
  }
}
