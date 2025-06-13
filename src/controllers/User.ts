import { Request, Response } from 'express';
import { createUserSchema } from '../validations/user';
import { UserService } from '../services/userService';
import catchAsync from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { User } from '../models';
import { verifyToken } from '../utils/jwt';

const authService = new UserService();

export const registerUser = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('req.body recebido:', req.body);
    
    // Validação do corpo da requisição
    const validated = createUserSchema.parse(req.body);
    console.log('dados validados:', validated);

    // Verifica se o email já está em uso
    const emailTaken = await authService.isEmailTaken(validated.email);
    if (emailTaken) {
      throw new ApiError(400, `Email já está em uso, ${validated.email}}`);
    }
    
    // Cria o usuário
    const user = await authService.createUser(validated);
    console.log('usuário criado no controller:', user);

    // Retorna sucesso com id e email
    return res.status(201).json({ id: user.id, email: user.email, role: user.role });

  } catch (err) {
    console.error('Erro no controller:', err);
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    // Caso seja erro de validação do Zod ou outro erro inesperado
    return res.status(400).json({ message: err instanceof Error ? err.message : String(err) });
  }
});

export const getUserById = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.params.id;

  // Busca o usuário pelo ID
  const user = await authService.getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  // Retorna os dados do usuário
  return res.status(200).json({ id: user.id, email: user.email });
});

export const getUserByEmail = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  const email = req.params.email;

  const user = await authService.findUserByEmail(email);
  if (!user) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  return res.status(200).json({ id: user.id, email: user.email });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  const { token } = req.query;
  
  try {
    const decoded = verifyToken(token as string);
    
    if (decoded.type !== 'verifyEmail') {
      throw new ApiError(400, 'Token inválido');
    }

    const user = await authService.getUserById(decoded.userId);
    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado');
    }

    await User.update(
      { isEmailVerified: true },
      { where: { id: user.id } }
    );

    return res.status(200).json({ message: 'Email verificado com sucesso' });
  } catch (error) {
    throw new ApiError(400, 'Token inválido ou expirado');
  }
});