import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: String,
  passwordHash: String,
  role: Boolean,
});

export const UserModel = mongoose.model("User", UserSchema);
