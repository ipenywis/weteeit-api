import { Sequelize } from 'sequelize-typescript';
import { ProdConfig, DevConfig } from './config';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(
        process.env.NODE_ENV === 'production' ? ProdConfig : DevConfig,
      );
      //TODO: Add all models to sequelize
      await sequelize.sync();
      return sequelize;
    },
  },
];
