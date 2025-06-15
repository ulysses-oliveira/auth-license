import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User, VerificationCode } from '../models';
import { CreateUserData, AuthTokenPayload, UserRole } from '../types';
import { generateVerificationCode } from '../utils/validators';
import EmailService from './EmailService';
import type { UserAttributes } from '../models/User';

class AuthService {
  async createUser(userData: CreateUserData): Promise<UserAttributes> {
    const user = await User.create({
      ...userData,
      is_email_verified: userData.is_email_verified ?? false,
      role: userData.role ?? UserRole.USER,
    });
    return user.toJSON();
  }

  async findUserByEmail(email: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { email } });
    return user ? user.toJSON() : null;
  }

  async findUserByGoogleId(googleId: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { google_id: googleId } });
    return user ? user.toJSON() : null;
  }

  async generateVerificationCode(userId: string): Promise<string> {
    const code = generateVerificationCode();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Remove códigos antigos do usuário
    await VerificationCode.destroy({
      where: { user_id: userId }
    });

    // Cria novo código
    await VerificationCode.create({
      user_id: userId,
      code,
      expires_at: expires_at,
      used: false,
    });

    return code;
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    const verificationRecord = await VerificationCode.findOne({
      where: {
        user_id: userId,
        code,
        used: false,
        expires_at: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (!verificationRecord) {
      return false;
    }

    // Marcar código como usado
    await verificationRecord.update({ used: true });

    // Marcar email como verificado
    await User.update(
      { is_email_verified: true },
      { where: { id: userId } }
    );

    return true;
  }

  async sendVerificationEmail(user: UserAttributes): Promise<void> {
    if (!user || !user.id) {
      throw new Error('Usuário inválido');
    }
    const code = await this.generateVerificationCode(user.id);
    await EmailService.sendVerificationEmail(user.email, code, user.name);
  }

  generateJWTToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
  }

  verifyJWTToken(token: string): AuthTokenPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
  }
}

export default new AuthService();