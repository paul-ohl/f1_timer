import { Request, Response } from 'express';
import User, { createUser } from '../types/user';
import { find_user_by_email, register_user } from '../services/user.service';
import { generateJwtToken } from '../utils/jwt';
import Email from '../types/email';

export async function registerUser(req: Request, res: Response) {
  const { email, password, role } = req.body;

  let newUser: User;
  try {
    newUser = await createUser(null, email, password, role);
  } catch (e: any) {
    res.status(400).send(e.message);
    return;
  }

  try {
    await register_user(newUser);
  } catch (e: any) {
    res.status(500).send(e.message);
    return;
  }
  res.status(201).send('User created');
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  let domainEmail: Email;
  try {
    domainEmail = new Email(email);
  } catch (e: any) {
    res.status(400).send("Invalid email");
    return;
  }
  let db_user: User;
  try {
    db_user = await find_user_by_email(domainEmail);
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
    res.status(401).send('Login failed');
  }
}
