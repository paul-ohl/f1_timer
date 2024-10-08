import mongoose, { Schema } from "mongoose";
import PasswordHash from "../types/passwordHash";

export type UserId = string;

export interface User {
  id?: UserId;
  email: string;
  passwordHash: PasswordHash;
  role: boolean;
}

const UserSchema = new Schema({
  email: String,
  passwordHash: String,
  role: Boolean,
});

export const UserModel = mongoose.model("User", UserSchema);
