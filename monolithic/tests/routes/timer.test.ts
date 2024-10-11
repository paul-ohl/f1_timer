import { connect_to_database } from '../../src/config/db';
import router from '../../src/routes/router';
import express from 'express';
import { equal } from 'assert';
import mongoose from 'mongoose';
import {
  find_user_by_email,
  register_user,
} from '../../src/services/user.service';
import { assert } from 'console';
import User, { createUser, userToModel } from '../../src/types/user';
import { generateJwtToken } from '../../src/utils/jwt';
import { createTimer } from '../../src/services/timer.service';
import { describe, before, after } from 'mocha';

describe('Timer routes', () => {
  let server: any;
  let port = Math.floor(Math.random() * 1000) + 3000;
  let jwtToken: string;
  let userId: string;

  before(async () => {
    process.env.JWT_SECRET = 'secret';

    const db_uri = `mongodb://localhost:27017/test-${generateRandomString()}`;
    process.env.MONGO_URI = db_uri;

    await connect_to_database();

    const app: express.Express = express();
    app.use(express.json());
    app.use('/', router);
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    const user = await createUser(null, 'test@test.fr', 'password', true);
    userId = await register_user(user);
    jwtToken = generateJwtToken({
      id: userId,
      email: user.email,
      role: user.role,
      passwordHash: user.passwordHash,
    } as User);
  });

  after(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close();
    await server.close();
  });

  it('Timer route fails if no jwt is provided', async () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      timer: 1.05,
    });

    const response = await fetch(`http://localhost:${port}/timer`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    });
    equal(response.status, 401);
    equal(await response.text(), 'Missing Authorization token');
  });

  it('Timer route if information is missing', async () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${jwtToken}`);

    const raw = JSON.stringify({
      nothing: null,
    });

    const response = await fetch(`http://localhost:${port}/timer`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    });
    equal(response.status, 400);
    equal(await response.text(), 'Please provide a time value');
  });

  it('createTimer route succeeds if information is correct', async () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${jwtToken}`);

    const raw = JSON.stringify({
      time: 1.05,
    });

    const response = await fetch(`http://localhost:${port}/timer`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    });
    equal(response.status, 201);
    equal(await response.text(), 'Timer created');
  });

  it('getTimersByUid succeeds with correct information', async () => {
    const timerId1 = await createTimer(userId, 1.005);
    const timerId2 = await createTimer(userId, 1.009);

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${jwtToken}`);

    const response = await fetch(`http://localhost:${port}/timer`, {
      headers: myHeaders,
      redirect: 'follow',
    });
    equal(response.status, 200);
    // Would be good to check the contents of the result...
  });
});

function generateRandomString(): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
