// src/routes/user.routes.ts
import { Router } from 'express';
import validate from '../../middlewares/validate';
import { createUserSchema, verifyEmailSchema } from '../../validations/user';
import { getUserByEmail, getUserById, registerUser, verifyEmail } from '../../controllers/User';

const userRoutes = Router();

userRoutes
  .post('/register', validate(createUserSchema), registerUser)
  .get('/verify-email', validate(verifyEmailSchema), verifyEmail)
  .get('/:email', getUserByEmail)
  .get('/:id', getUserById);

export default userRoutes;