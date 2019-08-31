import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Order } from './models/order';
import { NewOrderInput } from './dto/new-order.input';
import { OrderSerivce } from './order.service';
import { BadRequestException, HttpException, Res } from '@nestjs/common';

@Resolver(of => Order)
//@UseFilters(SequelizeExceptionFilter)
export class OrderResolver {
  constructor(private readonly ordersService: OrderSerivce) {}

  @Query(returns => [Order], { name: 'orders' })
  async getOrders() {
    return await this.ordersService.findAll().catch(err => {
      throw err;
    });
  }

  @Query(returns => Order, { name: 'orderById' })
  async getOrderById(@Args('id') id: string) {
    return await this.ordersService.findById(id).catch(err => {
      throw err;
    });
  }

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

    console.log('Order: ', order);
    return order;
  }
}
