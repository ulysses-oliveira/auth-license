import app from './app';
import config from './config/config';
import logger from './config/logger';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

let server: ReturnType<typeof app.listen>;

// Conexão com PostgreSQL
async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL');

    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL', error);
    process.exit(1);
  }
}

startServer();

// Encerramento limpo
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      prisma.$disconnect().then(() => process.exit(1));
    });
  } else {
    process.exit(1);
  }
};

// Erros inesperados
const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close(() => {
      prisma.$disconnect().then(() => logger.info('Process terminated'));
    });
  }
});
