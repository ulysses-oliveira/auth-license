// src/routes/user.routes.ts
import { Router } from 'express';
import validate from '../../middlewares/validate';
import { createUserSchema } from '../../validations/user';
import { getUserByEmail, getUserById, registerUser } from '../../controllers/userController';

const userRoutes = Router();

userRoutes
  .post('/register', validate(createUserSchema), registerUser)
  .get('/:email', getUserByEmail)
  .get('/:id', getUserById);

export default userRoutes;