import { Router } from 'express';
import UserController from '../../controllers/UserController';
import { authenticateToken, requireRole } from '../../middlewares/auth';
import { UserRole } from '../../types';

const router = Router();

router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.updateProfile);
router.get('/all', authenticateToken, requireRole(UserRole.ADM), UserController.getAllUsers);

export default router;