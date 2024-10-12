import express, { Express } from 'express';
import router from './routes/router';

async function main() {
  const appPort = process.env.TIME_PORT;
  if (!appPort) {
    console.error('TIME_PORT is not defined');
    process.exit(1);
  }

  const app: Express = express();
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/', router);

  app.listen(appPort, () => {
    console.log(`Time microservice is running on port ${appPort}`);
  });
}

main();
