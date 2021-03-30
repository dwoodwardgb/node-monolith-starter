import { Connection } from "typeorm";
import passport from "passport";

export const passportMiddleware = [passport.initialize(), passport.session()];

export const initializePassport = (db: Connection) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // TODO setup strategy, connect to user service, add auth-controller
};
