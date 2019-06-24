import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Order } from './models/order';
import { NewOrderInput } from './dto/new-order.input';
import { UseFilters } from '@nestjs/common';
import { SequelizeExceptionFilter } from '../filters/sequelize.filters';
import { OrderSerivce } from './order.service';

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
  something(@Args('id') id: string) {
    return { lastName: 'Meow Meow!' };
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
}
