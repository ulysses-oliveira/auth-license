import { Router } from 'express';
import { registerUser, verifyEmail } from '../../controllers/User';

const router = Router();

router.post('/register', registerUser);
router.get('/verify', verifyEmail);

export default router; 