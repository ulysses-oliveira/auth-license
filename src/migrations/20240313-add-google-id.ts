import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('users', 'google_id', {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'google_id');
  }
}; 