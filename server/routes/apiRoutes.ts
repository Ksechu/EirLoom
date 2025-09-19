import express from 'express';
// Импортируем именованные экспорты
import { testConnection, generateText } from '../controllers/apiController';

const router = express.Router();

router.get('/test-connection', testConnection);
router.post('/generate', generateText);

export default router;