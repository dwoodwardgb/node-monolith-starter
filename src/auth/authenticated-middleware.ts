import { NextFunction, Request, Response } from "express";

declare module "express-session" {
  interface Session {
    returnTo?: string;
  }
}

export default function authenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
}
