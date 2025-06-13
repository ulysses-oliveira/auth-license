import sequelize from '../config/database';
import User from './User';
import VerificationCode from './VerificationCode';

export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
};

export { User, VerificationCode };