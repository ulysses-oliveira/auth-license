import { z } from 'zod';
import { passwordSchema } from './custom.validation';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: passwordSchema,
    name: z.string().min(1, 'Nome é obrigatório'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Token de atualização é obrigatório'),
  }),
});

export const refreshTokensSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Token de atualização é obrigatório'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
  }),
});

export const resetPasswordSchema = z.object({
  query: z.object({
    token: z.string().min(1, 'Token é obrigatório'),
  }),
  body: z.object({
    password: passwordSchema,
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(1, 'Token é obrigatório'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type LogoutInput = z.infer<typeof logoutSchema>['body'];
export type RefreshTokensInput = z.infer<typeof refreshTokensSchema>['body'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>['query']; 