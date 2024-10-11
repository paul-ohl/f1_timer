import { UserModel } from '../models/user.model';
import Email from '../types/email';
import PasswordHash from '../types/passwordHash';
import User, { UserId, createUser, userToModel } from '../types/user';

export async function register_user(user: User): Promise<UserId> {
  const newUser = new UserModel(userToModel(user));
  const savedUser = await newUser.save();
  if (savedUser) {
    return savedUser.id;
  } else {
    throw new Error('Failed to create user');
  }
}

export async function find_user_by_email(email: Email): Promise<User> {
  const dbUser = await UserModel.findOne({ email: email });

  if (!dbUser) {
    throw new Error('User not found');
  } else if (!dbUser.email || !dbUser.passwordHash || !dbUser.role) {
    throw new Error('User data is invalid');
  }

  const passwordHash = new PasswordHash();
  passwordHash.fromHash(dbUser.passwordHash);
  return createUser(dbUser.id, dbUser.email, passwordHash, dbUser.role);
}
