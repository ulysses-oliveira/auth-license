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

      if (!user) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
        return;
      }

      // Enviar código de verificação
      await AuthService.sendVerificationEmail(user);

      res.status(201).json({
        message: 'Usuário criado! Verifique seu email para o código de verificação.',
        email: user.email,
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

      // Enviar código de verificação
      await AuthService.sendVerificationEmail(user);

      res.json({
        message: 'Código de verificação enviado para seu email',
        email: user.email,
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
          const userInstance = await User.findOne({ where: { email: googlePayload.email } });
          if (userInstance) {
            await userInstance.update({
              google_id: googlePayload.sub,
              picture: googlePayload.picture,
              is_email_verified: googlePayload.email_verified,
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

          const userInstance = await User.findOne({ where: { google_id: googlePayload.sub } });
          if (userInstance) {
            await userInstance.update({ is_email_verified: googlePayload.email_verified });
          }
        }
      }

      if (!user) {
        res.status(500).json({ error: 'Erro ao processar usuário' });
        return;
      }

      // Se o email não foi verificado pelo Google, enviar código
      if (!user.is_email_verified) {
        await AuthService.sendVerificationEmail(user);
        
        res.json({
          message: 'Código de verificação enviado para seu email',
          email: user.email,
          requiresVerification: true,
        });
        return;
      }

      // Gerar JWT token
      const jwtToken = AuthService.generateJWTToken({
        googleId: user.google_id,
        email: user.email,
        role: user.role as UserRole,
      });

      res.json({
        message: 'Login realizado com sucesso',
        token: jwtToken,
        user: {
          googleId: user.google_id,
          email: user.email,
          name: user.name,
          role: user.role,
          picture: user.picture,
          is_email_verified: user.is_email_verified,
        },
      });
    } catch (error) {
      console.error('Erro na autenticação Google:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        res.status(400).json({ error: 'Email e código são obrigatórios' });
        return;
      }

      // Buscar usuário pelo email
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      // Verificar código
      const isValidCode = await AuthService.verifyCode(user.id, code);
      if (!isValidCode) {
        res.status(400).json({ error: 'Código inválido ou expirado' });
        return;
      }

      // Buscar usuário atualizado
      const updatedUser = await User.findOne({ where: { email } });
      if (!updatedUser) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      // Gerar JWT token
      const token = AuthService.generateJWTToken({
        id: updatedUser.id,
        googleId: updatedUser.google_id,
        email: updatedUser.email,
        role: updatedUser.role as UserRole,
      });

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: updatedUser.id,
          googleId: updatedUser.google_id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          picture: updatedUser.picture,
          is_email_verified: updatedUser.is_email_verified,
        },
      });
    } catch (error) {
      console.error('Erro na verificação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async resendCode(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email é obrigatório' });
        return;
      }

      const user = await AuthService.findUserByEmail(email);
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