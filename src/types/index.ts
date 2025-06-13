export enum UserRole {
  ADM = 'ADM',
  USER = 'USER'
}

export interface CreateUserData {
  email: string;
  password?: string;
  name: string;
  role?: UserRole;
  google_id?: string;
  picture?: string;
  isEmailVerified?: boolean;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface GoogleTokenPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}