import dotenv from 'dotenv';
import { Dialect } from 'sequelize';g';

dotenv.config();

interface DatabaseConfig {
  url: string;
  dialect: Dialect;
  logging?: boolean | ((msg: string) => void);
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

const config: Config = {
  development: {
    url: process.env.DATABASE_URL!,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    url: process.env.DATABASE_URL!,
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.DATABASE_URL!,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

export default config; 