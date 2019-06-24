import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Order } from './models/order';
import { isEmpty } from 'lodash';
import { NewOrderInput } from '../orders/dto/new-order.input';
import { ProductService } from '../products/product.service';

@Injectable()
export class OrderSerivce {
  static LAST_TRANSACTION_ID: string;

  constructor(
    @Inject('ORDERS_REPOSITORY')
    private readonly ORDERS_REPOSITORY: typeof Order,
    private readonly productsService: ProductService,
  ) {}

  findById(id: string) {
    return new Promise(async (rs, rj) => {
      const order = await this.ORDERS_REPOSITORY.findOne({
        where: { id },
      }).catch(err => rj(err));
      if (!order || isEmpty(order))
        return rj(new NotFoundException('No Order found with id'));
      return rs(order);
    });
  }

  findByTransactionId(transactionId: string) {
    return new Promise(async (rs, rj) => {
      const order = await this.ORDERS_REPOSITORY.findOne({
        where: { transactionId },
      }).catch(err => rj(err));
      if (!order || isEmpty(order))
        return rj(new NotFoundException('No Order found with transactionId'));
      return rs(order);
    });
  }

  findAll() {
    return new Promise(async (rs, rj) => {
      console.log('Fetching Order by id');
      const orders = await this.ORDERS_REPOSITORY.findAll().catch(err =>
        rj(err),
      );
      if (!orders || isEmpty(orders))
        return rj(
          new NotFoundException('No Orders are available at the moment'),
        );
      return rs(orders);
    });
  }

  private generateTransactionId(): string {
    const date = new Date();
    const currentTime = parseInt(
      date
        .getTime()
        .toString()
        .substr(0, 4),
    );
    const randTimeNum = Math.floor(Math.random() * currentTime);
    return (OrderSerivce.LAST_TRANSACTION_ID = `TID${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}T${randTimeNum}`);
  }

  storeOrder(orderInput: NewOrderInput) {
    return new Promise(async (rs, rj) => {
      console.log('Resolving Serivce Promise in Order');
      //Check if target product exists before placing it
      if (!(await this.productsService.productExists(orderInput.productId))) {
        return rj(
          new BadRequestException(
            'Product does not exists, either it was removed or never been created, please try again later',
          ),
        );
      }
      const transactionId = this.generateTransactionId();
      const order = await this.ORDERS_REPOSITORY.create({
        ...orderInput,
        transactionId,
      });
      if (!order || isEmpty(order))
        return rj(
          new InternalServerErrorException(
            'Could not place order, please try again later',
          ),
        );
      return rs(order);
    });
  }
}
