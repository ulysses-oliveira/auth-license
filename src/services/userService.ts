import { ifError } from 'assert';
import { User, License } from '../models';
import { IUserCreation, IUser } from '../types/User';
import { generateToken } from '../utils/jwt';
import { EmailService } from './emailService';

export class AuthService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    return !!user;
  }

  async createUser(userData: IUserCreation) {
    if (!userData.email) {
      throw new Error(`Email é obrigatório, userService.ts, primeiro ${userData.email}}`);
    }

    const user = await User.create({
      ...userData,
      role: userData.role || 'USER'
    });

    // Gerar token de verificação
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: 'verifyEmail'
    });

    // Enviar email de verificação
    await this.emailService.sendVerificationEmail(user.email, token);

    return user;
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findByPk(id);
    return user;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({
      where: { email },
      include: [{
        model: License,
        as: 'licenses'
      }]
    });
    return user;
  }
}