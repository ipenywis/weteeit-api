import { SequelizeConfig } from 'sequelize-typescript/lib/types/SequelizeConfig';

const DevConfig: SequelizeConfig = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Bb09042000"',
  database: 'weteeit',
};

//TODO: Add Production Config

const ProdConfig: SequelizeConfig = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'weteeit',
};

export { DevConfig, ProdConfig };
