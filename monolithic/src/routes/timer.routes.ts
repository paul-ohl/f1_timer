import { Router } from "express";
import {
  getTimerByUser as getTimersByUid,
  saveTimer,
} from "../controllers/timer.controller";
import { authMiddleware } from "../middleware/auth";

const timerRouter = Router();

timerRouter.post("/timer", authMiddleware, saveTimer);
timerRouter.get("/timer", authMiddleware, getTimersByUid);

export default timerRouter;
