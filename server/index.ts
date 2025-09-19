// server/src/index.ts
import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import apiRoutes from './routes/apiRoutes';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Логируем все входящие запросы для отладки
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Запрос: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`[Сервер]: Сервер запущен на http://localhost:${PORT}`);
});