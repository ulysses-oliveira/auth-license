// src/routes/index.ts
import { Router } from 'express';
import userRoutes from './User';
import googleOAuthRoutes from './googleOAuthRoutes';

const router = Router();

router.use('/google', googleOAuthRoutes)
router.use('/users', userRoutes);

export default router;
