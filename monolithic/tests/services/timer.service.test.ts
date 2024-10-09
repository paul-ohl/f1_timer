import { connect_to_database } from "../../src/config/db";
import router from "../../src/routes/router";
import * as express from "express";
import { equal, notEqual } from "assert";
import mongoose from "mongoose";
import {
  find_user_by_email,
  register_user,
} from "../../src/services/user.service";
import { assert } from "console";
import User, { createUser, userToModel } from "../../src/types/user";
import {
  generateJwtToken,
  JwtPayload,
  verifyJwtToken,
} from "../../src/utils/jwt";
import { loginUser } from "../../src/controllers/user.controller";
import {
  createTimer,
  getTimersByUserID as getTimersByUserId,
} from "../../src/services/timer.service";
import { TimerModel } from "../../src/models/timer.model";

describe("Timer routes", () => {
  let userId: string;

  before(async () => {
    process.env.JWT_SECRET = "secret";

    const db_uri = `mongodb://localhost:27017/test-${generateRandomString()}`;
    process.env.MONGO_URI = db_uri;

    await connect_to_database();

    const user = await createUser(null, "test@test.fr", "password", true);
    userId = await register_user(user);
  });

  after(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await TimerModel.deleteMany({});
  });

  it("createTimer succeeds with correct information", async () => {
    const timerId = await createTimer(userId, 1.005);

    const timerDB = await TimerModel.findOne({ id: timerId });
    equal(timerDB?.time, 1.005);
  });

  it("getTimerByUserId succeeds with correct information", async () => {
    const timerId1 = await createTimer(userId, 1.005);
    const timerId2 = await createTimer(userId, 1.009);

    const timers = await getTimersByUserId(userId);

    equal(timers.length, 2);
    const timer1 = timers.find((t) => t.id == timerId1);
    notEqual(timer1, undefined);
    equal(timer1?.userId, userId);
    equal(timer1?.time, 1.005);
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
