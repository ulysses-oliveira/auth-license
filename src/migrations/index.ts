import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import addAllColumns from './20240313-add-all-columns';

async function runMigrations() {
  try {
    await addAllColumns.up(sequelize.getQueryInterface());
    console.log('Migrações concluídas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
  } finally {
    await sequelize.close();
  }
}

runMigrations(); 