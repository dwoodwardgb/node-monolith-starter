const addDb = db =>
  (req, res, next) => {
    req.db = db
    next()
  }

const logger = (req, res, next) => {
  console.log('yee')
}

export const createMiddleware = db => [
  addDb(db),
  logger
]
