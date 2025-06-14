export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  licenses?: Array<{
    id: string;
    userId: string;
    status: string;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
  }>;
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
}