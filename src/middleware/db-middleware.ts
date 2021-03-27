export default (db) => (req, res, next) => {
  req.db = db;
  next();
};
