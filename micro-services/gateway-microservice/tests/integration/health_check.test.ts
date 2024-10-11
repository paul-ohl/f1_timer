import { Server } from 'http';
import router from '../../src/routes/router';
import express from 'express';

describe('Health check route', () => {
  let server: Server;
  const port = Math.floor(Math.random() * 1000) + 3000;

  beforeAll(async () => {
    const app: express.Express = express();
    app.use(express.json());
    app.use('/', router);
    server = app.listen(port, () => {
      console.log('Server is running on port 3000');
    });
  });

  afterAll(async () => {
    server.close();
    console.log('Server closed');
  });

  test('should return 200 OK', async () => {
    const response = await fetch(`http://localhost:${port}/health`);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
    expect(await response.text()).toBe('OK');
  });
});
