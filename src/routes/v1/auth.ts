import { Router } from 'express';
import { registerUser, verifyEmail } from '../../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.get('/verify', verifyEmail);

export default router; 