import { Request, Response } from 'express';
import { User } from '../models';
import { AuthenticatedRequest } from '../middlewares/auth';

class UserController {
  async getProfile(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    try {
      const user = await User.findByPk(authReq.user!.userId, {
        attributes: ['id', 'email', 'name', 'role', 'picture', 'isEmailVerified', 'created_at'],
      });

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    try {
      const { name, picture } = req.body;
      const updateData: any = {};

      if (name) updateData.name = name;
      if (picture) updateData.picture = picture;

      const [affectedRows] = await User.update(updateData, {
        where: { id: authReq.user!.userId },
      });

      if (affectedRows === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      const updatedUser = await User.findByPk(authReq.user!.userId, {
        attributes: ['id', 'email', 'name', 'role', 'picture', 'isEmailVerified'],
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    try {
      const users = await User.findAll({
        attributes: ['id', 'email', 'name', 'role', 'isEmailVerified', 'created_at'],
      });

      res.json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new UserController();