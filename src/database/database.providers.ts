import { Sequelize } from 'sequelize-typescript';
import { ConnectionTimedOutError, ConnectionError } from 'sequelize';
import { ProdConfig, DevConfig } from './config';
import { Product } from '../products/models/product';
import { Order } from '../orders/models/order';

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
        sequelize.addModels([Product, Order]);
        //SYNC MODELS METADATA to DB
        return await sequelize.sync();
      } catch (err) {
        console.log(err);
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
