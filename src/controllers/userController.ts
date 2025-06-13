import { Request, Response } from 'express';
import { createUserSchema } from '../validations/user';
import { UserService } from '../services/userService';
import catchAsync from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';

const userService = new UserService();

export const registerUser = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('req.body recebido:', req.body);
    
    // Validação do corpo da requisição
    const validated = createUserSchema.parse(req.body);
    console.log('dados validados:', validated);

    // Verifica se o email já está em uso
    const emailTaken = await userService.isEmailTaken(validated.email);
    if (emailTaken) {
      throw new ApiError(400, `Email já está em uso, ${validated.email}}`);
    }
    
    // Cria o usuário
    const user = await userService.createUser(validated);
    console.log('usuário criado no controller:', user);

    // Retorna sucesso com id e email
    return res.status(201).json(user);

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
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  // Retorna os dados do usuário
  return res.status(200).json({ id: user.id, email: user.email });
});

export const getUserByEmail = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  const email = req.params.email;

  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new ApiError(404, 'Usuário não encontrado');
  }

  return res.status(200).json({ id: user.id, email: user.email });
});