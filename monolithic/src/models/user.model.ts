import { Schema } from "mongoose";
import PasswordHash from "../types/password_hash";

export type UserId = number;

export interface User {
  id: UserId;
  email: string;
  password_hash: string;
  role: boolean;
}

export interface NewUser {
  email: string;
  passwordHash: PasswordHash;
  role: boolean;
}

export const NewUserSchema = new Schema({
  email: String,
  password_hash: String,
  role: Boolean,
});
