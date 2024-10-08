import mongoose from "mongoose";
import { NewUser, NewUserSchema, UserId } from "../models/user.model";

export async function register_user(user: NewUser): Promise<UserId> {
  const NewUserModel = mongoose.model("User", NewUserSchema);
  const newUser = new NewUserModel(user);
  const savedUser = await newUser.save();
  if (savedUser) {
    return savedUser.id;
  } else {
    throw new Error("Failed to create user");
  }
}
