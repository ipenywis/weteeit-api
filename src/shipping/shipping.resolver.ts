import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';
import { GqlAuthGuard } from '../guards/admin.guard';
import { NewShippingInput } from './dto/ new-shipping.input';
import { Shipping } from './models/shipping';
import { ShippingService } from './shipping.service';

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

  @Query(returns => Boolean, { name: 'shippingExists' })
  async shippingExists(@Args('wilaya') wilaya: string) {
    return await this.shippingsService.shippingExists(wilaya).catch(err => {
      throw err;
    });
  }

  @UseGuards(GqlAuthGuard)
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

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean, { name: 'updateShipping' })
  async updateShipping(
    @Args({ type: () => Int, name: 'id' }) id: number,
    @Args('updateShippingInput') updateShippingInput: NewShippingInput,
  ) {
    return await this.shippingsService
      .updateShipping(id, updateShippingInput)
      .catch(err => {
        throw err;
      });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean, { name: 'deleteShipping' })
  async deleteShipping(@Args({ type: () => Int, name: 'id' }) id: number) {
    return await this.shippingsService.deleteShipping(id).catch(err => {
      throw err;
    });
  }
}
