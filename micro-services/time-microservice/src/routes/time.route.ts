import { Router } from 'express';
import {
  getTimeByUser as getTimesByUid,
  saveTime,
} from '../controllers/time.controller';

const timeRouter = Router();

timeRouter.get('/time', getTimesByUid).post('/time', saveTime);

export default timeRouter;
