import { equal } from "assert";
import { createUser, userToModel } from "../../src/types/user";
import { assert } from "console";
import PasswordHash from "../../src/types/passwordHash";

describe("User domain object", () => {
  it("should be able to create a user", async () => {
    let user = await createUser(null, "test@test.fr", "password", true);
    let model = userToModel(user);
    equal(model.email, "test@test.fr");
    equal(model.role, true);
    assert(user.passwordHash.verify("password"));
    equal(model.id, undefined);

    user = await createUser("123", "test@test.fr", "password", true);
    model = userToModel(user);
    equal(model.email, "test@test.fr");
    equal(model.role, true);
    assert(user.passwordHash.verify("password"));
    equal(model.id, "123");

    const hasher = new PasswordHash();
    user = await createUser(null, "test@test.fr", await hasher.fromClearPassword("password"), true);
    model = userToModel(user);
    equal(model.email, "test@test.fr");
    equal(model.role, true);
    assert(user.passwordHash.verify("password"));
    equal(model.id, undefined);

    user = await createUser("123", "test@test.fr", await hasher.fromClearPassword("password"), true);
    model = userToModel(user);
    equal(model.email, "test@test.fr");
    equal(model.role, true);
    assert(user.passwordHash.verify("password"));
    equal(model.id, "123");
  });

  it("should fail if user data is invalid", async () => {
    let error: any = null;
    try {
      await createUser(null, "", "password", true);
    } catch (e) {
      error = e;
    }
    assert(error !== null);
    equal(error.message, "User data is invalid");

    error = null;
    try {
      await createUser(null, "test@test.fr", "", true);
    } catch (e) {
      error = e;
    }
    assert(error !== null);
    equal(error.message, "User data is invalid");
  });
});
