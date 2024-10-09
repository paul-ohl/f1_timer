import User from "../types/user";
import * as jwt from "jsonwebtoken";

export interface JwtPayload {
  uid: string;
  email: string;
  role: boolean;
}

export function generateJwtToken(user: User): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  if (!user.id) {
    throw new Error("User data is incomplete");
  }
  const payload: JwtPayload = {
    uid: user.id,
    email: user.email.getEmail(),
    role: user.role,
  };
  return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: "10h" });
}

export function verifyJwtToken(token: string): JwtPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  const decoded: jwt.JwtPayload = jwt.verify(
    token,
    process.env.JWT_SECRET,
  ) as jwt.JwtPayload;
  return decoded.payload as JwtPayload;
}
