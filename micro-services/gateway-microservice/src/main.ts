import express, { Express } from 'express';
import router from './routes/router';

async function main() {
  const appPort = process.env.GATEWAY_PORT;
  if (!appPort) {
    console.error('GATEWAY_PORT is not defined');
    process.exit(1);
  }

  const app: Express = express();
  app.use(express.json());
  app.use('/', router);
  app.listen(appPort, () => {
    console.log(`Server is running on port ${appPort}`);
  });
}

main();
