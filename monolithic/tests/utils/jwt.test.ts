import { assert } from "console";
import * as jwt from "jsonwebtoken";
import { verifyJwtToken, generateJwtToken } from "../../src/utils/jwt";
import { User } from "../../src/models/user.model";
import PasswordHash from "../../src/types/passwordHash";
import { equal } from "assert";

describe("Jwt generator", () => {
  it("should fail if JWT_SECRET is not set", async () => {
    const hasher = new PasswordHash();
    const user: User = {
      id: "123",
      role: true,
      email: "paul@test.fr",
      passwordHash: await hasher.fromClearPassword("password"),
    };
    let error: any = null;
    try {
      generateJwtToken(user);
    } catch (e) {
      error = e;
    }
    assert(error !== null);
    equal(error.message, "JWT_SECRET is not set");
  });

  it("should fail if data is incomplete", async () => {
    process.env.JWT_SECRET = "secret";
    const hasher = new PasswordHash();
    const user: User = {
      role: true,
      email: "paul@test.fr",
      passwordHash: await hasher.fromClearPassword("password"),
    };
    let error: any = null;
    try {
      generateJwtToken(user);
    } catch (e) {
      error = e;
    }
    assert(error !== null);
    equal(error.message, "User data is incomplete");
  });

  it("should fail if jwt is badly encoded", async () => {
    process.env.JWT_SECRET = "wrong_secret";
    const hasher = new PasswordHash();
    const user: User = {
      id: "123",
      role: true,
      email: "paul@test.fr",
      passwordHash: await hasher.fromClearPassword("password"),
    };

    let error: any = null;
    let token: string = "";
    try {
      token = generateJwtToken(user);
    } catch (e) {
      error = e;
    }

    process.env.JWT_SECRET = "secret";
    try {
      verifyJwtToken(token);
    } catch (e) {
      error = e;
    }
    assert(error !== null);
    equal(error.message, "invalid signature");
  });

  it("should fail if jwt is corrupted", async () => {
    process.env.JWT_SECRET = "secret";
    const hasher = new PasswordHash();
    const user: User = {
      id: "123",
      role: true,
      email: "paul@test.fr",
      passwordHash: await hasher.fromClearPassword("password"),
    };

    let error: any = null;
    let token: string = "";
    try {
      token = generateJwtToken(user);
    } catch (e) {
      error = e;
    }
    token = token + "a";

    try {
      verifyJwtToken(token);
    } catch (e) {
      error = e;
    }
    assert(error !== null);
    equal(error.message, "invalid signature");
  });

  it("should succeed if no problem", async () => {
    process.env.JWT_SECRET = "secret";
    const hasher = new PasswordHash();
    const user: User = {
      id: "123",
      role: true,
      email: "paul@test.fr",
      passwordHash: await hasher.fromClearPassword("password"),
    };

    let error: any = null;
    let token: string = "";
    try {
      token = generateJwtToken(user);
    } catch (e) {
      error = e;
    }
    assert(error === null);
    assert(token !== "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    assert(decoded !== null);
    const decoded_payload = decoded as any;
    equal(decoded_payload.payload.uid, user.id);
    equal(decoded_payload.payload.password, undefined);
    equal(decoded_payload.payload.passwordHash, undefined);

    const payload = verifyJwtToken(token);
    assert(payload.uid === user.id);
    assert(payload.email === user.email);
    assert(payload.role === user.role);
  });
});
