// src/routes/index.ts
import { Router } from 'express';
import userRoutes from './User';
// import config from '../../config/config';

const router = Router();

router.use('/users', userRoutes);

export default router;
