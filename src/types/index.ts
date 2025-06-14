export enum UserRole {
  ADM = 'ADM',
  USER = 'USER'
}

export interface CreateUserData {
  id?: string;
  email: string;
  password?: string;
  name: string;
  role?: UserRole;
  google_id?: string;
  picture?: string;
  is_email_verified?: boolean;
}

export interface AuthTokenPayload {
  id: string;
  googleId: string | null;
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