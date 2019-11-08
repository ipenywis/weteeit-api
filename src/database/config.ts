import { SequelizeConfig } from 'sequelize-typescript/lib/types/SequelizeConfig';

const DevConfig: SequelizeConfig = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Bb09042000"',
  database: 'weteeit',
  logging: true,
};

//TODO: Add Production Config

const ProdConfig: SequelizeConfig = (() => {
  return {
    dialect: 'mysql',
    host: 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Bb09042000"',
    database: process.env.DB_NAME || 'weteeit',
    logging: false,
  };
})();

export { DevConfig, ProdConfig };
