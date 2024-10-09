import PasswordHash from "../types/passwordHash";
import Email from "../types/email";

export type UserId = string;

interface User {
  id?: UserId;
  email: Email;
  passwordHash: PasswordHash;
  role: boolean;
}

export async function createUser(
  id: UserId | null,
  email: string,
  password: string | PasswordHash,
  role: boolean,
): Promise<User> {
  if (!email || !role || !password) {
    throw new Error("User data is invalid");
  }

  let passwordHash: PasswordHash;

  if (password instanceof PasswordHash) {
    passwordHash = password;
  } else {
    const hasher = new PasswordHash();
    passwordHash = await hasher.fromClearPassword(password);
  }

  return {
    id,
    email: new Email(email),
    passwordHash,
    role,
  };
}

export function userToModel(user: User) {
  if (user.id) {
    return {
      email: user.email.getEmail(),
      passwordHash: user.passwordHash.getHash(),
      role: user.role,
      id: user.id,
    };
  }
  return {
    email: user.email.getEmail(),
    passwordHash: user.passwordHash.getHash(),
    role: user.role,
  };
}

export default User;
