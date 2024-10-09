import { Request, Response } from "express";
import PasswordHash from "../types/passwordHash";
import { User } from "../models/user.model";
import { find_user_by_email, register_user } from "../services/user.service";
import { generateJwtToken } from "../utils/jwt";

export async function registerUser(req: Request, res: Response) {
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
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  let db_user: User;
  try {
    db_user = await find_user_by_email(email);
  } catch (e: any) {
    res.status(400).send(e.message);
    return;
  }

  let result = await db_user.passwordHash.verify(password);
  if (result) {
    try {
      const token = generateJwtToken(db_user);
      res.status(200).send(token);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  } else {
    res.status(401).send("Login failed");
  }
}
