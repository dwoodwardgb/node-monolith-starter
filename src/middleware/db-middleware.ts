export const createDbMiddleware = (db) => (req, res, next) => {
  req.db = db;
  next();
};
