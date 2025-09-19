// server\routes\apiRoutes.ts
import { Router } from 'express';
import { generateTextController } from '../controllers/apiController';

const router = Router();

router.post('/generate', generateTextController);

export default router;