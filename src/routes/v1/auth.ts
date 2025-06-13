import { Router } from 'express';
import AuthController from '../../controllers/AuthController';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/google', AuthController.googleAuth);
router.post('/verify', AuthController.verify);
router.post('/resend-code', AuthController.resendCode);

export default router;