import { Router } from 'express';
import timeRouter from './time.route';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

router.use('/', timeRouter);

export default router;
