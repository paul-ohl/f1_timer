import argon2 from "argon2";

class PasswordHash {
  private hash: string;

  constructor() {
    this.hash = "";
  }

  async fromClearPassword(password: string): Promise<void> {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    this.hash = await argon2.hash(password);
  }

  fromHash(hash: string): void {
    this.hash = hash;
  }

  getHash(): string {
    return this.hash;
  }

  verify(password: string): Promise<boolean> {
    return argon2.verify(this.hash, password);
  }
}

export default PasswordHash;
