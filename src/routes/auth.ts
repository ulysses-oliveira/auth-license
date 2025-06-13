import { Router } from 'express';
import { googleOAuthService } from '../services/googleOAuthService';

const router = Router();

// Rota para iniciar o processo de autenticação
router.get('/google', (req, res) => {
  const authUrl = googleOAuthService.generateAuthUrl();
  res.redirect(authUrl);
});

// Rota de callback do Google
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Código de autorização inválido' });
    }

    const { userInfo, jwtToken, refreshToken } = await googleOAuthService.handleGoogleCallback(code);

    // Aqui você pode salvar o usuário no banco de dados se necessário
    
    // Retorna o token JWT e informações do usuário
    res.json({
      token: jwtToken,
      refreshToken,
      user: userInfo
    });
  } catch (error) {
    console.error('Erro no callback do Google:', error);
    res.status(500).json({ error: 'Erro na autenticação' });
  }
});

// Exemplo de rota protegida
router.get('/protected', googleOAuthService.authMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({ message: 'Rota protegida', user });
});

export default router; 