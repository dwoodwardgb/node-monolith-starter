import express from "express";
import { connect } from "./db";
import { createMiddleware } from "./middleware";
import router from "./routes";

const app = express();

export const start = async () => {
  const db = await connect();
  app.use(...createMiddleware(db));
  app.use(router);
  app.listen(process.env.PORT);
};
