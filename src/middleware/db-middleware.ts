import { NextFunction, Request, Response } from "express";
import { Connection } from "typeorm";

declare module "express" {
  interface Request {
    db: Connection;
  }
}

export const createDbMiddleware = (db: Connection) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.db = db;
  next();
};
