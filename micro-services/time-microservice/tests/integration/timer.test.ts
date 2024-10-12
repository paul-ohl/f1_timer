// import router from '../../src/routes/router';
// import express from 'express';
// import mongoose from 'mongoose';
// import { createTime } from '../../src/services/time.service';
// import { connect_to_database } from '../../src/config/db';
//
// describe('Time routes', () => {
//   let server: any;
//   let port = Math.floor(Math.random() * 1000) + 3000;
//
//   beforeAll(async () => {
//     const db_uri = `mongodb://localhost:27017/test-${generateRandomString()}`;
//     process.env.MONGO_URI = db_uri;
//
//     await connect_to_database();
//
//     const app: express.Express = express();
//     app.use(express.json());
//     app.use('/', router);
//     server = app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   });
//
//   afterAll(async () => {
//     await mongoose.connection.db?.dropDatabase();
//     await mongoose.connection.close();
//     await server.close();
//   });
//
//   it('Time route fails if information is missing', async () => {
//     const myHeaders = new Headers();
//     myHeaders.append('Content-Type', 'application/json');
//
//     const raw = JSON.stringify({
//       nothing: null,
//     });
//
//     const response = await fetch(`http://localhost:${port}/time`, {
//       method: 'POST',
//       headers: myHeaders,
//       body: raw,
//       redirect: 'follow',
//     });
//     equal(response.status, 400);
//     equal(await response.text(), 'Please provide a time value');
//   });
//
//   it('createTime route succeeds if information is correct', async () => {
//     const myHeaders = new Headers();
//     myHeaders.append('Content-Type', 'application/json');
//     myHeaders.append('Authorization', `Bearer ${jwtToken}`);
//
//     const raw = JSON.stringify({
//       time: 1.05,
//     });
//
//     const response = await fetch(`http://localhost:${port}/time`, {
//       method: 'POST',
//       headers: myHeaders,
//       body: raw,
//       redirect: 'follow',
//     });
//     equal(response.status, 201);
//     equal(await response.text(), 'Time created');
//   });
//
//   it('getTimesByUid succeeds with correct information', async () => {
//     const timeId1 = await createTime(userId, 1.005);
//     const timeId2 = await createTime(userId, 1.009);
//
//     const myHeaders = new Headers();
//     myHeaders.append('Authorization', `Bearer ${jwtToken}`);
//
//     const response = await fetch(`http://localhost:${port}/time`, {
//       headers: myHeaders,
//       redirect: 'follow',
//     });
//     equal(response.status, 200);
//     // Would be good to check the contents of the result...
//   });
// });
//
// function generateRandomString(): string {
//   const characters =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   const charactersLength = characters.length;
//   for (let i = 0; i < 10; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }
