import express from "express";
import { initializePassport } from "./auth/passport";
import { connect } from "./db";
import { createMiddleware } from "./middleware";
import router from "./routes";

const server = express();

export async function start() {
  const db = await connect();

  initializePassport(db);

  server.use(...createMiddleware(db));
  server.use(router);

  server.listen(process.env.PORT, () => {
    console.log(process.env.NODE_ENV, process.env.PORT);
  });
}
