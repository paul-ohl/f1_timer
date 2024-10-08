import { connect_to_database } from "./config/db";
import * as express from "express";
import router from "./routes/router";

async function main() {
  try {
    await connect_to_database();
    console.log("Connected to Database");
  } catch (error) {
    console.error("Failed to connect to Database: ", error);
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  const app: express.Express = express();
  app.use(express.json());
  app.use("/", router);
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
