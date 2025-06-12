import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';
import config from '../config/config';


export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.verifyEmailExpirationMinutes });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};