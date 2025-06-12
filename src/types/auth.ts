export interface JwtPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  type: 'access' | 'refresh' | 'verifyEmail' | 'resetPassword';
}

export interface EmailVerificationPayload {
  email: string;
  token: string;
}

export interface UserData {
  email: string;
  password: string;
  name: string;
  role: 'USER' | 'ADMIN';
} 