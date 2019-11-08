import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Order } from './models/order';
import { NewOrderInput } from './dto/new-order.input';
import { OrderSerivce } from './order.service';
import { Int } from 'type-graphql';
import { ProductWithQuantity } from './types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/admin.guard';

@Resolver(of => Order)
//@UseFilters(SequelizeExceptionFilter)
export class OrderResolver {
  constructor(private readonly ordersService: OrderSerivce) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [Order], { name: 'orders' })
  async getOrders() {
    return await this.ordersService.findAll().catch(err => {
      throw err;
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => [ProductWithQuantity], { name: 'orderProducts' })
  async getOrderProducts(@Args({ type: () => Int, name: 'id' }) id: number) {
    return await this.ordersService.getOrderProducts(id).catch(err => {
      throw err;
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => Order, { name: 'orderById' })
  async getOrderById(@Args('id') id: string) {
    return await this.ordersService.findById(id).catch(err => {
      throw err;
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => Order, { name: 'orderByTransactionId' })
  async getOrderByTransactionId(@Args('transactionId') transactionId: string) {
    return await this.ordersService
      .findByTransactionId(transactionId)
      .catch(err => {
        throw err;
      });
  }

  @Mutation(returns => Order, { nullable: true })
  async storeOrder(@Args('newOrderData') newOrderData: NewOrderInput) {
    newOrderData = JSON.parse(JSON.stringify(newOrderData));
    const order = await this.ordersService
      .storeOrder(newOrderData)
      .catch(err => {
        throw err;
      });

    return order;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean, { nullable: true, name: 'orderShipped' })
  async orderShipped(
    @Args({ name: 'id', type: () => Int, nullable: false }) id: number,
  ) {
    return await this.ordersService.setOrderShipped(id).catch(err => {
      throw err;
    });
  }
}
