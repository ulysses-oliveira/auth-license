import { DataTypes, Model, Optional, Sequelize, Op } from 'sequelize';
import License from './License';
import * as bcrypt from 'bcrypt';

// Atributos do modelo
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  googleId?: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Atributos opcionais na criação
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'googleId' | 'isEmailVerified' | 'createdAt' | 'updatedAt'> {}

// Classe do modelo
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public googleId?: string;
  public role!: 'USER' | 'ADMIN';
  public isEmailVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associações (serão definidas depois)
  public licenses?: License[];

  /**
   * Verifica se o email já está em uso
   * @param email - Email do usuário
   * @param excludeUserId - ID do usuário a ser excluído da verificação
   * @returns Promise<boolean>
   */
  public static async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    const user = await this.findOne({
      where: {
        email,
        ...(excludeUserId && { id: { [Op.ne]: excludeUserId } })
      }
    });
    return !!user;
  }

  /**
   * Verifica se a senha corresponde à senha do usuário
   * @param password - Senha a ser verificada
   * @returns Promise<boolean>
   */
  public async isPasswordMatch(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Método estático para inicializar o modelo
  public static initModel(sequelize: Sequelize): typeof User {
    User.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 255]
        }
      },
      googleId: {
        type: DataTypes.STRING,
        field: 'google_id',
        unique: true,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        defaultValue: 'USER',
        allowNull: false
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        field: 'is_email_verified',
        defaultValue: false,
        allowNull: false
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
      modelName: 'User',
      tableName: 'User',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeSave: async (user: User) => {
          console.log('Password changed:', user.changed('password'));
          console.log('Password value:', user.password);
          console.log('Password type:', typeof user.password);

          if (user.changed('password') && typeof user.password === 'string') {
            const salt = await bcrypt.genSalt(8);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    });

    return User;
  }
}

export default User;