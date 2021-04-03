import express from "express";
import { join } from "path";
import session from "express-session";
import helmet from "helmet";
import logger from "./logger-middleware";
import { createDbMiddleware } from "./db-middleware";
import { passportMiddleware } from "../auth/passport";
import { Connection } from "typeorm";

const isProd = process.env.NODE_ENV === "production";

export const createMiddleware = (db: Connection) => [
  helmet(),
  createDbMiddleware(db),
  logger,
  session({
    cookie: {
      secure: isProd,
      httpOnly: true,
      signed: true,
      maxAge: 864000000, // 10 days
    },
    secret: process.env.SESSION_SECRET,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    unset: "keep",
    proxy: isProd,
  }),
  ...passportMiddleware,
  express.static(join(__dirname, "..", "public")),
];
