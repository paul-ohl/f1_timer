import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import JwtPayload from "../types/jwtPayload";

export function generateJwtToken(user: User): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  if (!user.id) {
    throw new Error("User data is incomplete");
  }
  const payload: JwtPayload = {
    uid: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: "10h" });
}

export function verifyJwtToken(token: string): JwtPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded as JwtPayload;
}
