import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { User } from './User';

// Atributos do modelo
interface LicenseAttributes {
  id: string;
  userId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LicenseCreationAttributes extends Optional<LicenseAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class License extends Model<LicenseAttributes, LicenseCreationAttributes> implements LicenseAttributes {
  public id!: string;
  public userId!: string;
  public status!: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  public expiresAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associações
  declare user?: typeof User;
}

export default (sequelize: Sequelize) => {
  
  License.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'EXPIRED'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: 'licenses',
      timestamps: true
    }
  );

  return License;
};