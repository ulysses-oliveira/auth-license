import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import GoogleAuthService from '../services/GoogleAuthService';
import { validateEmail, validatePassword } from '../utils/validators';
import { UserRole } from '../types';
import { User } from '../models';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Validações
      if (!email || !password || !name) {
        res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
        return;
      }

      if (!validateEmail(email)) {
        res.status(400).json({ error: 'Email inválido' });
        return;
      }

      if (!validatePassword(password)) {
        res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        return;
      }

      // Verificar se usuário já existe
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'Usuário já existe com este email' });
        return;
      }

      // Criar usuário
      const user = await AuthService.createUser({
        email,
        password,
        name,
        role: UserRole.USER,
      });

      if (!user || !user.id) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
        return;
      }

      // Enviar código de verificação
      await AuthService.sendVerificationEmail(user);

      res.status(201).json({
        message: 'Usuário criado! Verifique seu email para o código de verificação.',
        userId: user.id,
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
        return;
      }

      // Buscar usuário
      const user = await AuthService.findUserByEmail(email);
      if (!user || !user.password) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Verificar senha
      const validPassword = await AuthService.verifyPassword(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      if (!user.id) {
        res.status(500).json({ error: 'Erro ao processar usuário' });
        return;
      }

      // Enviar código de verificação
      await AuthService.sendVerificationEmail(user);

      res.json({
        message: 'Código de verificação enviado para seu email',
        userId: user.id,
        requiresVerification: true,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ error: 'Token do Google é obrigatório' });
        return;
      }

      // Verificar token do Google
      const googlePayload = await GoogleAuthService.verifyGoogleToken(token);

      // Buscar usuário existente
      let user = await AuthService.findUserByGoogleId(googlePayload.sub);

      if (!user) {
        // Verificar se já existe usuário com o mesmo email
        user = await AuthService.findUserByEmail(googlePayload.email);
        
        if (user) {
          // Atualizar usuário existente com Google ID
          const userInstance = await User.findByPk(user.id);
          if (userInstance) {
            await userInstance.update({
              google_id: googlePayload.sub,
              picture: googlePayload.picture,
              isEmailVerified: googlePayload.email_verified,
            });
          }
        } else {
          // Criar novo usuário
          user = await AuthService.createUser({
            google_id: googlePayload.sub,
            email: googlePayload.email,
            name: googlePayload.name,
            picture: googlePayload.picture,
            role: UserRole.USER,
          });

          const userInstance = await User.findByPk(user.id);
          if (userInstance) {
            await userInstance.update({ isEmailVerified: googlePayload.email_verified });
          }
        }
      }

      if (!user || !user.id) {
        res.status(500).json({ error: 'Erro ao processar usuário' });
        return;
      }

      // Se o email não foi verificado pelo Google, enviar código
      if (!user.isEmailVerified) {
        await AuthService.sendVerificationEmail(user);
        
        res.json({
          message: 'Código de verificação enviado para seu email',
          userId: user.id,
          requiresVerification: true,
        });
        return;
      }

      // Gerar JWT token
      const jwtToken = AuthService.generateJWTToken({
        userId: user.id,
        email: user.email,
        role: user.role as UserRole,
      });

      res.json({
        message: 'Login realizado com sucesso',
        token: jwtToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          picture: user.picture,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      console.error('Erro na autenticação Google:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const { userId, code } = req.body;

      if (!userId || !code) {
        res.status(400).json({ error: 'ID do usuário e código são obrigatórios' });
        return;
      }

      // Verificar código
      const isValidCode = await AuthService.verifyCode(userId, code);
      if (!isValidCode) {
        res.status(400).json({ error: 'Código inválido ou expirado' });
        return;
      }

      // Buscar usuário atualizado
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      // Gerar JWT token
      const token = AuthService.generateJWTToken({
        userId: user.id,
        email: user.email,
        role: user.role as UserRole,
      });

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          picture: user.picture,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      console.error('Erro na verificação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async resendCode(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'ID do usuário é obrigatório' });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      await AuthService.sendVerificationEmail(user);

      res.json({ message: 'Novo código enviado para seu email' });
    } catch (error) {
      console.error('Erro ao reenviar código:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new AuthController();