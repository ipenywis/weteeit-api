import { Order } from './models/order';
import { OrderProduct } from './models/orderProduct';

export const ordersProviders = [
  {
    provide: 'ORDERS_REPOSITORY',
    useValue: Order,
  },
  {
    provide: 'ORDER_PRODUCTS_REPOSITORY',
    useValue: OrderProduct,
  },
];
