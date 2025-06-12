import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((val) => /\d/.test(val) && /[a-zA-Z]/.test(val), {
      message: 'A senha deve conter ao menos uma letra e um número',
    }),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(1, 'Token é obrigatório'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>['query'];
