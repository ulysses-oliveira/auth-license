import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface VerificationCodeAttributes {
  id: string;
  user_id: string;
  code: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

interface VerificationCodeCreationAttributes extends Optional<VerificationCodeAttributes, 'id' | 'created_at'> {}

class VerificationCode extends Model<VerificationCodeAttributes, VerificationCodeCreationAttributes> implements VerificationCodeAttributes {
  public id!: string;
  public user_id!: string;
  public code!: string;
  public expires_at!: Date;
  public used!: boolean;
  public created_at!: Date;
}

VerificationCode.init(
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
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'VerificationCode',
    tableName: 'verification_codes',
    timestamps: false,
    underscored: true,
  }
);

// Associações
User.hasMany(VerificationCode, { foreignKey: 'user_id', as: 'verificationCodes' });
VerificationCode.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default VerificationCode;