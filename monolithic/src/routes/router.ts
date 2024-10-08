import { Router } from "express";
import PasswordHash from "../types/password_hash";
import { NewUser } from "../models/user.model";
import { register_user } from "../services/user.service";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200);
  res.send("OK");
});

router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  const hashedPassword = new PasswordHash();
  try {
    await hashedPassword.fromClearPassword(password);
  } catch (e: any) {
    res.status(400).send(e.message);
    return;
  }

  const newUser: NewUser = {
    email,
    passwordHash: hashedPassword,
    role,
  };

  try {
    await register_user(newUser);
  } catch (e: any) {
    res.status(500).send(e.message);
    return;
  }
  res.status(201);
  res.send("User created");
});

export default router;
