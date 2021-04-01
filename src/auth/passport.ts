import { Connection } from "typeorm";
import passport from "passport";
import { createStrategy } from "./auth0-strategy";

export const passportMiddleware = [passport.initialize(), passport.session()];

export const initializePassport = (db: Connection) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(createStrategy(db));
};
