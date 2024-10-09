import { connect_to_database } from "../../src/config/db";
import router from "../../src/routes/router";
import * as express from "express";
import { equal } from "assert";
import mongoose from "mongoose";
import {
  find_user_by_email,
  register_user,
} from "../../src/services/user.service";
import { assert } from "console";
import { User } from "../../src/models/user.model";
import PasswordHash from "../../src/types/passwordHash";
import { verifyJwtToken } from "../../src/utils/jwt";

describe("User authentication route", () => {
  let server: any;
  let port = Math.floor(Math.random() * 1000) + 3000;

  before(async () => {
    process.env.JWT_SECRET = "secret";

    const db_uri = `mongodb://localhost:27017/test-${generateRandomString()}`;
    process.env.MONGO_URI = db_uri;

    await connect_to_database();

    const app: express.Express = express();
    app.use(express.json());
    app.use("/", router);
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });

  after(async () => {
    // await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close();
    await server.close();
  });

  describe("User Registration", () => {
    it("Register with correct data returns a 200 and saves user to db", async () => {
      const email = `${generateRandomString()}@test.fr`;

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: email,
        password: "password",
        role: true,
      });

      const response = await fetch(`http://localhost:${port}/register`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });
      equal(response.status, 201);
      equal(await response.text(), "User created");

      const db_user = await find_user_by_email(email);
      equal(db_user.role, true);
      assert(await db_user.passwordHash.verify("password"));
    });
  });

  describe("User Login", () => {
    before(async () => {
      const hasher = new PasswordHash();
      const user: User = {
        passwordHash: await hasher.fromClearPassword("password"),
        role: true,
        email: "test@test.fr",
      };
      await register_user(user);
    });

    it("Login works with correct data", async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: "test@test.fr",
        password: "password",
      });

      const response = await fetch(`http://localhost:${port}/login`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });
      equal(response.status, 200);
      const token = await response.text();
      const jwt_payload = verifyJwtToken(token);
      equal(jwt_payload.email, "test@test.fr");
      const db_user = await find_user_by_email("test@test.fr");
      equal(jwt_payload.uid, db_user.id);
    });
  });
});

function generateRandomString(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
