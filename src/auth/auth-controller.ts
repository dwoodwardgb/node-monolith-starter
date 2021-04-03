import { Router } from "express";
import { URL } from "node:url";
import passport from "passport";
import querystring from "querystring";

const router = Router();

// magic copy pasta from https://auth0.com/blog/create-a-simple-and-secure-node-express-app/
// I promise it works
// TODO make it fit in our heads a bit better?

router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  }),
  function login(req, res) {
    res.redirect("/");
  }
);

router.get("/auth0webhook", (req, res, next) => {
  passport.authenticate("auth0", function auth0Webhook(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/");
    });
  })(req, res, next);
});

router.get("/logout", function logout(req, res) {
  req.logOut();

  let returnTo = req.protocol + "://" + req.hostname;
  const port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo =
      process.env.NODE_ENV === "production"
        ? `${returnTo}/`
        : `${returnTo}:${port}/`;
  }

  const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);

  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo,
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL.toString());
});

export default router;
