import { Sequelize } from 'sequelize';
import config from '../config/config';

// Configuração do Sequelize
const sequelize = new Sequelize(config.postgres.url, {
  dialect: 'postgres',
  logging: (msg) => {
    if (config.env === 'development' && !msg.includes('Executing')) {
      console.log(msg);
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Importar modelos
import UserModel from './User';
import LicenseModel from './License';

// Inicializar modelos
const User = UserModel(sequelize);
const License = LicenseModel(sequelize);

// Inicializar associações
const initModels = async () => {
  try {
    // Sincronizar banco de dados
    await sequelize.sync({ force: true }); // force: true irá recriar as tabelas
    console.log('Banco de dados sincronizado com sucesso');

    // Inicializar associações
    User.hasMany(License, { 
      foreignKey: 'userId', 
      as: 'licenses',
      onDelete: 'CASCADE'
    });
    License.belongsTo(User, { 
      foreignKey: 'userId', 
      as: 'user',
      onDelete: 'CASCADE'
    });

    console.log('Modelos inicializados com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar modelos:', error);
    throw error;
  }
};

// Exportar instância do Sequelize e modelos
export { sequelize, initModels };
export { User, License };

// Exportar como default um objeto com tudo
export default {
  sequelize,
  User,
  License,
  initModels
};