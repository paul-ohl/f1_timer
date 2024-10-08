import { Router } from "express";
import PasswordHash from "../types/passwordHash";
import { User } from "../models/user.model";
import { find_user_by_email, register_user } from "../services/user.service";
import { generateJwtToken } from "../utils/jwt";
import { authMiddleware } from "../middleware/auth";

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

router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  const hashedPassword = new PasswordHash();
  try {
    await hashedPassword.fromClearPassword(password);
  } catch (e: any) {
    res.status(400).send(e.message);
    return;
  }

  const newUser: User = {
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
  res.status(201).send("User created");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let db_user;
  try {
    db_user = await find_user_by_email(email);
  } catch (e: any) {
    res.status(400).send(e.message);
    return;
  }

  db_user.passwordHash.verify(password).then((result: boolean) => {
    if (result) {
      res.status(200).send(generateJwtToken(db_user));
    } else {
      res.status(401).send("Login failed");
    }
  });
});

export default router;
