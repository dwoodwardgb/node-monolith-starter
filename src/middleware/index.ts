export const createMiddleware = (db) => [
  require("./db-middleware")(db),
  require("./logger-middleware"),
];
