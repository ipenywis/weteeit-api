import { ConnectionError, ConnectionTimedOutError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Admin } from '../admin/models/admin';
import { Order } from '../orders/models/order';
import { OrderProduct } from '../orders/models/orderProduct';
import { Product } from '../products/models/product';
import { Shipping } from '../shipping/models/shipping';
import { DevConfig, ProdConfig } from './config';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const currentConfig =
        process.env.NODE_ENV === 'production' ? ProdConfig : DevConfig;
      const sequelize = new Sequelize(currentConfig);
      //TODO: Add all models to sequelize
      try {
        //ADD ALL MODELS HERE
        sequelize.addModels([Product, Order, OrderProduct, Shipping, Admin]);
        //SYNC MODELS METADATA to DB
        return await sequelize.sync();
      } catch (err) {
        console.error(err);
        //Handle Connection Errors
        if (err instanceof ConnectionTimedOutError)
          console.error(
            `Cannot Connect to Database, Connection Refused, Please make sure database is running on ${currentConfig.host}:${currentConfig.port}`,
          );
        else if (err instanceof ConnectionError)
          console.error('Cannot Connect to Database, Connection Error', err);
        //Stop process
        process.exit(69);
      }
    },
  },
];
