import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import User from './User';

// Atributos do modelo
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
  // Atributos
  declare id: string;
  declare userId: string;
  declare status: 'active' | 'inactive' | 'expired';
  declare expiresAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
 
  // Associações
  declare user?: User;

  // Método estático para inicializar o modelo
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
      // tableName: 'license',
      timestamps: true,
      // underscored: true
    });

    return License;
  }

  public static async createLicenseForUser1(): Promise<License> {
    const userId = '00000000-0000-0000-0000-000000000001'; // UUID válido para o usuário 1
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Licença válida por 1 ano

    return await License.create({
      userId,
      status: 'active',
      expiresAt
    });
  }   
}

// console.log(License === sequelize.models.License)
export default License;