// server/index.ts
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});