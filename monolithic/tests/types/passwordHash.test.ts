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
});
