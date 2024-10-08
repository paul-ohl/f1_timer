import { connect_to_database } from "./config/db";
import express, { Express } from "express";
import router from "./routes/router";

async function main() {
  try {
    await connect_to_database();
    console.log("Connected to Database");
  } catch (error) {
    console.error("Failed to connect to Database: ", error);
    return;
  }

  const app: Express = express();
  app.use(express.json());
  app.use("/", router);
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
