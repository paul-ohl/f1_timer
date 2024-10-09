import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import userRouter from "./user.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200);
  res.send("OK");
});

router.get("/protected", authMiddleware, (_req, res) => {
  const userEmail = res.locals.jwt.email;
  res.status(200);
  res.send(`Protected OK for ${userEmail}`);
});

router.use("/", userRouter);

export default router;
