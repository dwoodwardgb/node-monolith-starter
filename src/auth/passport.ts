import { Connection } from "typeorm";
import passport from "passport";
import { createStrategy } from "./auth0-strategy";

export const passportMiddleware = [passport.initialize(), passport.session()];

export function initializePassport(db: Connection) {
  passport.serializeUser(function serializeUser(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function deserializeUser(user, done) {
    done(null, user);
  });

  passport.use(createStrategy(db));
}
