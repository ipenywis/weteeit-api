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
import { OrderProduct } from '../orders/models/orderProduct';
import { Op } from 'sequelize';

@Injectable()
export class OrderSerivce {
  static LAST_TRANSACTION_ID: string;

  constructor(
    @Inject('ORDERS_REPOSITORY')
    private readonly ORDERS_REPOSITORY: typeof Order,
    @Inject('ORDER_PRODUCTS_REPOSITORY')
    private readonly ORDER_PRODUCTS_REPOSITORY: typeof OrderProduct,
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
      //Check if target product exists before placing order
      for (const product of orderInput.products) {
        if (!(await this.productsService.productExists(product.name))) {
          console.log('Product Does not exist: ', product);
          return rj(
            new BadRequestException(
              'Product(s) does not exists, either it was removed or never been created, please try again later',
            ),
          );
        }
      }

      const productNames = orderInput.products.map(item => item.name);
      const products = await this.productsService
        .findAllByName(productNames)
        .catch(err => rj(err));
      if (products && !isEmpty(products)) {
        //Generate unique transactionId for order
        const transactionId = this.generateTransactionId();
        //Prepare Order data
        const orderData: Partial<Order> = {
          email: orderInput.email,
          firstName: orderInput.firstName,
          lastName: orderInput.lastName,
          phone: orderInput.phone,
          facebook_profile: orderInput.facebook_profile,
          address: orderInput.address,
          wilaya: orderInput.wilaya,
          city: orderInput.city,
          instructions: orderInput.instructions,
          transactionId,
        };
        //Build & Save order
        const order = await this.ORDERS_REPOSITORY.create(orderData, {
          include: [
            {
              model: this.productsService.getProductsRepository(),
              as: 'products',
            },
          ],
        }).catch(err => {
          console.log('Orders Error: ', orderData, err);
          rj(new InternalServerErrorException());
        });
        if (!order || isEmpty(order))
          return rj(
            new InternalServerErrorException(
              'Could not place order, please try again later',
            ),
          );

        //Add Order=>Product OrderProduct join table
        for (const product of products) {
          const productWithQuantity = orderInput.products.find(
            item => item.name === product.name,
          );
          const quantity = productWithQuantity.quantity;
          await order
            .addProducts(product, { through: { quantity } })
            .catch(err => rj(new InternalServerErrorException()));
        }

        //Get plain order with it's products
        const plainOrder = order.get({ plain: true });
        const plainProducts = products.map(item => item.get({ plain: true }));

        //NOTE: code for getting orderProducts is `DISABLED`
        /*let plainProducts = (await order.getProducts()).map(item =>
          item.get({ plain: true }),
        );
        //Get Order Products
        const productsIds = plainProducts.map(item => item.id);
        const orderProduct = await this.ORDER_PRODUCTS_REPOSITORY.findAll({
          where: {
            product: { [Op.in]: productsIds } as any,
            order: plainOrder.id,
          },
        });*/
        return rs({
          ...plainOrder,
          products: plainProducts,
        });
      }
    });
  }
}
