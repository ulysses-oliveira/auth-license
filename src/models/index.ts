import { Sequelize } from 'sequelize';
import User from './User';
import License from './License';
import config from '../config/config';

// Configuração do Sequelize
const sequelize = new Sequelize(config.postgres.url, {
  dialect: 'postgres',
  logging: config.env === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Inicializar modelos
const UserModel = User.initModel(sequelize);
const LicenseModel = License.initModel(sequelize);

// Definir associações
UserModel.hasMany(LicenseModel, {
  foreignKey: 'userId',
  as: 'licenses'
});

LicenseModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user'
});

// Exportar instância do Sequelize e modelos
export { sequelize };
export { UserModel as User, LicenseModel as License };

// Exportar como default um objeto com tudo
export default {
  sequelize,
  User: UserModel,
  License: LicenseModel
};