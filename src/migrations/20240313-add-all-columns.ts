import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    // Função para verificar se uma coluna existe
    const columnExists = async (tableName: string, columnName: string) => {
      const tableInfo = await queryInterface.describeTable(tableName);
      return !!tableInfo[columnName];
    };

    // Adiciona todas as colunas necessárias
    if (!(await columnExists('users', 'google_id'))) {
      await queryInterface.addColumn('users', 'google_id', {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      });
    }

    if (!(await columnExists('users', 'isEmailVerified'))) {
      await queryInterface.addColumn('users', 'isEmailVerified', {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      });
    }

    if (!(await columnExists('users', 'picture'))) {
      await queryInterface.addColumn('users', 'picture', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }

    // Renomeia a coluna 'name' se ela existir como 'nome'
    if (await columnExists('users', 'nome') && !(await columnExists('users', 'name'))) {
      await queryInterface.renameColumn('users', 'nome', 'name');
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const columnExists = async (tableName: string, columnName: string) => {
      const tableInfo = await queryInterface.describeTable(tableName);
      return !!tableInfo[columnName];
    };

    if (await columnExists('users', 'google_id')) {
      await queryInterface.removeColumn('users', 'google_id');
    }

    if (await columnExists('users', 'isEmailVerified')) {
      await queryInterface.removeColumn('users', 'isEmailVerified');
    }

    if (await columnExists('users', 'picture')) {
      await queryInterface.removeColumn('users', 'picture');
    }

    if (await columnExists('users', 'name') && !(await columnExists('users', 'nome'))) {
      await queryInterface.renameColumn('users', 'name', 'nome');
    }
  }
}; 