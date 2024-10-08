import { User, UserId, UserModel } from "../models/user.model";
import PasswordHash from "../types/passwordHash";

export async function register_user(user: User): Promise<UserId> {
  const newUser = new UserModel({
    email: user.email,
    passwordHash: user.passwordHash.getHash(),
    role: user.role,
  });
  const savedUser = await newUser.save();
  if (savedUser) {
    return savedUser.id;
  } else {
    throw new Error("Failed to create user");
  }
}

export async function find_user_by_email(email: string): Promise<User> {
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new Error("User not found");
  } else if (!user.email || !user.passwordHash || !user.role) {
    throw new Error("User data is invalid");
  }

  const passwordHash = new PasswordHash();
  passwordHash.fromHash(user.passwordHash);
  return {
    id: user.id,
    email: user.email,
    passwordHash: passwordHash.fromHash(user.passwordHash),
    role: user.role,
  };
}
