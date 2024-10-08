import * as argon2 from "argon2";

class PasswordHash {
  private hash: string;

  constructor() {
    this.hash = "";
  }

  async fromClearPassword(password: string): Promise<PasswordHash> {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    this.hash = await argon2.hash(password);
    return this;
  }

  fromHash(hash: string): PasswordHash {
    this.hash = hash;
    return this;
  }

  getHash(): string {
    return this.hash;
  }

  verify(password: string): Promise<boolean> {
    return argon2.verify(this.hash, password);
  }
}

export default PasswordHash;
