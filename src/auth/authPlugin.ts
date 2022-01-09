import * as di from "awilix";
import { FastifyReply, FastifyRequest } from "fastify";
import createFastifyPlugin from "fastify-plugin";
import fastifyOauth2, { OAuth2Namespace, OAuth2Token } from "fastify-oauth2";
import decodeJwt from "jwt-decode";
import qs from "qs";
import { OnUserAuthenticated } from "./onUserAuthenticated";

declare module "fastify" {
  interface FastifyInstance {
    auth0: OAuth2Namespace;
  }
}

type Auth0Token = { id_token: string } & OAuth2Token;

const DEFAULT_REDIRECT_AFTER_LOGIN = "/";
const LOGIN_ROUTE = "/login";

const createAuthPlugin = ({
  onUserAuthenticated,
}: {
  onUserAuthenticated: OnUserAuthenticated;
}) =>
  createFastifyPlugin(
    async (server, _options) => {
      server.register(fastifyOauth2, {
        name: "auth0",
        credentials: {
          client: {
            id: process.env.AUTH0_CLIENT_ID,
            secret: process.env.AUTH0_CLIENT_SECRET,
          },
          auth: {
            authorizeHost: process.env.AUTH0_DOMAIN,
            authorizePath: "/authorize",
            tokenHost: process.env.AUTH0_DOMAIN,
            tokenPath: "/oauth/token",
          },
        },
        startRedirectPath: LOGIN_ROUTE,
        callbackUri: process.env.AUTH0_CALLBACK_URL,
        scope: ["openid", "email", "profile"],
      });

      server.get("/auth0webhook", async (request, reply) => {
        const { id_token } = <Auth0Token>(
          await server.auth0.getAccessTokenFromAuthorizationCodeFlow(request)
        );
        const user = await onUserAuthenticated(decodeJwt(id_token));
        request.session.set("user", user);
        const returnTo =
          request.session.get("returnTo") || DEFAULT_REDIRECT_AFTER_LOGIN;
        request.session.set("returnTo", undefined);
        reply.redirect(returnTo);
      });

      server.get("/logout", async (request, reply) => {
        request.session.set("user", undefined);
        reply.redirect(
          `${process.env.AUTH0_DOMAIN}/v2/logout?${qs.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            returnTo: "http://localhost:3000/",
          })}`
        );
      });
    },
    {
      decorators: {
        request: ["session"],
      },
    }
  );

createAuthPlugin[di.RESOLVER] = {
  register: di.asFunction,
  lifetime: di.Lifetime.SINGLETON,
};

export default createAuthPlugin;

export async function ensureAuthenticatedGuard(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.session.get("user")) {
    request.session.set("returnTo", request.url);
    reply.redirect(LOGIN_ROUTE);
  }
}
