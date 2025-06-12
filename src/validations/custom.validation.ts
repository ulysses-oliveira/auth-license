import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: 'Deve ser um ID válido do MongoDB',
});

export const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .refine(
    (val) => /\d/.test(val) && /[a-zA-Z]/.test(val),
    'A senha deve conter pelo menos 1 letra e 1 número'
  ); 