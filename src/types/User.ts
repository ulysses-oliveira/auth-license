export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  googleId?: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreation {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
}