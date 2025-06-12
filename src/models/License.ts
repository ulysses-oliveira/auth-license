import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import User from './User';

interface LicenseAttributes {
  id: string;
  userId: string;
  status: 'active' | 'inactive' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LicenseCreationAttributes extends Optional<LicenseAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class License extends Model<LicenseAttributes, LicenseCreationAttributes> implements LicenseAttributes {
  public id!: string;
  public userId!: string;
  public status!: 'active' | 'inactive' | 'expired';
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associações
  public user?: User;

  public static initModel(sequelize: Sequelize): typeof License {
    License.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'expired'),
        defaultValue: 'inactive',
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      modelName: 'License',
      tableName: 'license',
      timestamps: true,
      underscored: true
    });

    return License;
  }
}

export default License;