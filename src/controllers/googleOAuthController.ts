import { Request, Response } from 'express';
import { GoogleOAuthService } from '../services/GoogleAuthService';
import { UserService } from '../services/userService';
import { ApiError } from '../utils/ApiError';

export class GoogleOAuthController {
  private googleOAuthService: GoogleOAuthService;
  private userService: UserService;

  constructor() {
    this.googleOAuthService = new GoogleOAuthService();
    this.userService = new UserService();
  }

  authenticate = async (req: Request, res: Response) => {
    const { credential } = req.body;

    try {
      console.log('Verificando token...');
      const userData = await this.googleOAuthService.verifyToken(credential);

      if (!userData.name || !userData.email || !userData.sub) {
        throw new ApiError(400, 'Dados do usuário incompletos');
      }

      console.log('✅ Usuário autenticado com sucesso:');
      console.log('ID:', userData.sub);
      console.log('Nome:', userData.name);
      console.log('Email:', userData.email);

      // Verifica se o usuário já existe
      const existingUser = await this.userService.findUserByEmail(userData.email);
      
      if (!existingUser) {
        // Cria um novo usuário com os dados do Google
        const newUser = await this.userService.createUser({
          name: userData.name,
          email: userData.email,
          password: userData.sub, // Usando o ID do Google como senha
          role: 'USER'
        });

        console.log('✅ Novo usuário criado:', newUser);
        return res.status(201).json({ 
          message: 'Usuário criado e autenticado com sucesso!', 
          user: { 
            id: newUser.id,
            name: newUser.name, 
            email: newUser.email
          } 
        });
      }

      // Se o usuário já existe, retorna os dados dele
      return res.status(200).json({ 
        message: 'Usuário autenticado com sucesso!', 
        user: { 
          id: existingUser.id,
          name: existingUser.name, 
          email: existingUser.email
        } 
      });

    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      res.status(401).json({ 
        message: `Erro na autenticação: ${error}`,
        error: error,
        details: error
      });
    }
  }
}
