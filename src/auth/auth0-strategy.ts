import Auth0Strategy from "passport-auth0";
import { Connection } from "typeorm";
import { mask } from "superstruct";
import auth0ProfileSchema from "./auth0-profile-schema";
import { upsertUserByProfile } from "../users/user-service";

export function createStrategy(db: Connection) {
  return new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
    },
    function onAuthenticated(
      accessToken,
      refreshToken,
      extraParams,
      rawAuth0Profile,
      done
    ) {
      const auth0Profile = mask(rawAuth0Profile, auth0ProfileSchema);

      upsertUserByProfile(db, {
        auth0Id: auth0Profile.id,
        email: auth0Profile.emails[0].value,
        nickname: auth0Profile.nickname,
      }).then(
        (user) => done(null, user),
        (error) => done(error)
      );
    }
  );
}
