import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import User from './User';

// Atributos do modelo
interface LicenseAttributes {
  id: string;
  user_id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  expires_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface LicenseCreationAttributes extends Optional<LicenseAttributes, 'created_at' | 'updated_at'> {}

export class License extends Model<LicenseAttributes, LicenseCreationAttributes> implements LicenseAttributes {
  public id!: string;
  public user_id!: string;
  public status!: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  public expires_at!: Date;
  public created_at!: Date;
  public updated_at!: Date;

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
      user_id: {
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
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    },
    {
      sequelize,
      tableName: 'licenses',
      timestamps: true,
      underscored: true,
    }
  );

  return License;
};