import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import config from '../config/config';
import { sequelize } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    licenseId?: string;
    licenseStatus?: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const decoded = verifyToken(token);
    
    // Verificar se o usuário ainda existe
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

export const requireActiveLicense = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (req.user.licenseStatus !== 'active') {
    return res.status(403).json({ 
      error: 'Licença inativa ou expirada',
      licenseStatus: req.user.licenseStatus 
    });
  }

  next();
};
