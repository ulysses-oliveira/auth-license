import { User, License } from '../models';
import { IUserCreation, IUser } from '../types/User';
import { generateToken } from '../utils/jwt';
import { EmailService } from './emailService';
import { Op } from 'sequelize';

export class UserService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async createUser02(userData: IUserCreation) {
    const user = await User.create({
      ...userData,
      role: userData.role || 'USER'
    });
    console.log('Usuário criado:', user.toJSON())

    if (!user) {
      throw new Error('Erro ao criar usuário');
    }

    return user;
  }

  async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    const user = await User.findOne({
      where: {
        email,
        ...(excludeUserId && { id: { [Op.ne]: excludeUserId } })
      }
    });
    return !!user;
  }

  async createUser(userData: IUserCreation) {
    // Verificar se o email já está em uso
    const emailTaken = await this.isEmailTaken(userData.email);
    if (emailTaken) {
      throw new Error('Este email já está cadastrado');
    }

    if (!userData.email) {
      throw new Error('Email é obrigatório');
    }

    const user = await User.create({
      ...userData,
      role: userData.role || 'USER'
    });

    if (!user) {
      throw new Error('Erro ao criar usuário, userService.ts');
    }

    // Gerar token de verificação
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: 'verifyEmail'
    });

    // Enviar email de verificação
    await this.emailService.sendVerificationEmail(userData.email, token);

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