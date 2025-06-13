import { Sequelize } from 'sequelize';
import config from './config';

const sequelize = new Sequelize(
  config.postgres.url || 'postgresql://user:password@localhost:5432/mydb',
  {
    dialect: 'postgres',
    logging: config.env === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;