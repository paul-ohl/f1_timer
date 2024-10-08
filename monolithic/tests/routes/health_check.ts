import router from "../../src/routes/router";
import * as express from "express";
import { equal } from "assert";

describe("Health check route", () => {
  let server: any;
  let port = Math.floor(Math.random() * 1000) + 3000;

  before(async () => {
    const app: express.Express = express();
    app.use(express.json());
    app.use("/", router);
    server = app.listen(port, () => {
      console.log("Server is running on port 3000");
    });
  });

  after((done) => {
    server.close(() => {
      console.log("Server closed");
      done();
    });
  });

  it("should return 200 OK", async () => {
    const response = await fetch(`http://localhost:${port}/health`);
    equal(response.status, 200);
    equal(response.statusText, "OK");
  });
});
