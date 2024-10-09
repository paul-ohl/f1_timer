import { assert } from "console";
import PasswordHash from "../../src/types/passwordHash";
import { notEqual } from "assert";

describe("PasswordHash", () => {
  it("should be able to hash a password", async () => {
    const password = "password";
    const hasher = new PasswordHash();
    const hash = await hasher.fromClearPassword(password);
    notEqual(hash, password);

    const hasher2 = new PasswordHash();
    const hash2 = hasher2.fromHash(hash.getHash());

    const verify = await hash.verify(password);
    assert(verify);
    const verify2 = await hash2.verify(password);
    assert(verify2);
  });

  it("should fail if password is too short", async () => {
    const password = "pass";
    const hasher = new PasswordHash();
    let error: any = null;
    try {
      await hasher.fromClearPassword(password);
    } catch (e) {
      error = e;
    }
    assert(error !== null);
    assert(error.message === "Password must be at least 8 characters long");
  });
});
