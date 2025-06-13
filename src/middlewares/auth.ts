import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import { AuthTokenPayload, UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthenticatedRequest;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token de acesso requerido' });
    return;
  }

  try {
    const user = AuthService.verifyJWTToken(token);
    authReq.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
};

export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user || authReq.user.role !== role) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }
    next();
  };
};
