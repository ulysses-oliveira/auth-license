// src/routes/index.ts
import { Router } from 'express';
import userRoutes from './User';
import authRoutes from './auth';
// import config from '../../config/config';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;
