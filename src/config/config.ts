import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Validação do .env
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required().description('PostgreSQL connection string'),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number(),
  DB_NAME: Joi.string(),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),

  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),

  SMTP_HOST: Joi.string(),
  SMTP_PORT: Joi.number(),
  SMTP_USERNAME: Joi.string(),
  SMTP_PASSWORD: Joi.string(),
  EMAIL_FROM: Joi.string(),
})
  .unknown()
  .required();

const { value: envVars, error } = envVarsSchema.validate(process.env, {
  abortEarly: false,
  errors: { label: 'key' },
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Interface de tipagem (opcional, mas recomendado)
interface Config {
  env: string;
  port: number;
  postgres: {
    url: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
  };
  jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
    resetPasswordExpirationMinutes: number;
    verifyEmailExpirationMinutes: number;
  };
  email: {
    smtp: {
      host?: string;
      port?: number;
      auth: {
        user?: string;
        pass?: string;
      };
    };
    from?: string;
  };
}

// Config final exportada
const config: Config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  postgres: {
    url: envVars.DATABASE_URL,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    database: envVars.DB_NAME,
    username: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};

export default config;
