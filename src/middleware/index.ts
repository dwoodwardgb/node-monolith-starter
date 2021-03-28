import logger from "./logger-middleware";
import { createDbMiddleware } from "./db-middleware";

export const createMiddleware = (db) => [createDbMiddleware(db), logger];
