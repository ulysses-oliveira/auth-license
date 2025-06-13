import { User, License } from '../models';
import { IUserCreation, IUser } from '../types/User';
import { ApiError } from '../utils/ApiError';
import { Op } from 'sequelize';

export class UserService {
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
    const emailTaken = await this.isEmailTaken(userData.email);
    if (emailTaken) {
      throw new Error('Este email já está cadastrado');
    }

    if (!userData.email) {
      throw new Error('Email é obrigatório');
    }

    const user = await User.create({
      ...userData,
      role: userData.role || 'USER',
      isEmailVerified: true
    });

    if (!user) {
      throw new Error('Erro ao criar usuário, userService.ts');
    }

    return user.toJSON();
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findByPk(id);
    if (user === null) {
      throw new ApiError(404, `Usuário não encontrado, UserService.getUserById, ${id}`);
    }
    const userData = user.toJSON();
    return {
      ...userData,
      createdAt: userData.createdAt || new Date(),
      updatedAt: userData.updatedAt || new Date()
    };
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