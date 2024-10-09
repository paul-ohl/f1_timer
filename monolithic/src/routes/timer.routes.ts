import { Router } from "express";
import { saveTimer } from "../controllers/timer.controller";
import { authMiddleware } from "../middleware/auth";

const timerRouter = Router();

timerRouter.post("/timer", authMiddleware, saveTimer);

export default timerRouter;
