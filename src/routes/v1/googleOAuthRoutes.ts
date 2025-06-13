import { Router, Request, Response } from 'express';
import { GoogleOAuthController } from '../../controllers/googleOAuthController';

const router = Router();
const googleOAuthController = new GoogleOAuthController();

router.post('/auth', async (req: Request, res: Response) => {
  await googleOAuthController.authenticate(req, res);
});

export default router;