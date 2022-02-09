import { FastifyReply, FastifyRequest } from "fastify";
import createFastifyPlugin from "fastify-plugin";
import { AuthorizationCode } from "simple-oauth2";
import qs from "qs";
import { Static, Type } from "@sinclair/typebox";
import decodeJwt from "jwt-decode";

import { OnUserAuthenticated } from "./onUserAuthenticated";

const DEFAULT_REDIRECT_AFTER_LOGIN = "/";
const LOGIN_ROUTE = "/login";
const WEBHOOK_ROUTE = "/oauth/webhook";
const WEBHOOK_URL = `${process.env.PUBLIC_URL}${WEBHOOK_ROUTE}`;
const HOME_URL = `${process.env.PUBLIC_URL}/`;
export const USER_SESSION_FIELD_NAME = "user";

const createAuthPlugin = ({
  onUserAuthenticated,
}: {
  onUserAuthenticated: OnUserAuthenticated;
}) =>
  createFastifyPlugin(
    async (server, _options) => {
      const authClient = new AuthorizationCode({
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
      });

      // LOGIN ---------------------------------------------------------------

      const authUri = authClient.authorizeURL({
        redirect_uri: WEBHOOK_URL, // TODO can this be derived?
        scope: ["openid", "email", "profile"],
      });

      server.get(LOGIN_ROUTE, (_request, reply) => {
        reply.redirect(authUri);
      });

      // AUTH WEBHOOK --------------------------------------------------------

      const webhookQuerySchema = Type.Object({
        code: Type.String(),
      });

      server.get<{ Querystring: Static<typeof webhookQuerySchema> }>(
        WEBHOOK_ROUTE,
        { schema: { querystring: webhookQuerySchema } },
        async (request, reply) => {
          const {
            token: { id_token },
          } = await authClient.getToken({
            code: request.query.code,
            redirect_uri: WEBHOOK_URL,
          });
          const user = await onUserAuthenticated(decodeJwt(id_token));
          request.session.set(USER_SESSION_FIELD_NAME, user);
          const returnTo =
            request.session.get("returnTo") || DEFAULT_REDIRECT_AFTER_LOGIN;
          request.session.set("returnTo", undefined);
          reply.redirect(returnTo);
        }
      );

      // LOGOUT ---------------------------------------------------------------

      server.get("/logout", async (request, reply) => {
        request.session.set(USER_SESSION_FIELD_NAME, undefined);
        reply.redirect(
          `${process.env.AUTH0_DOMAIN}/v2/logout?${qs.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            returnTo: HOME_URL,
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

export default createAuthPlugin;

export async function ensureAuthenticatedGuard(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.session.get(USER_SESSION_FIELD_NAME)) {
    request.session.set("returnTo", request.url);
    reply.redirect(LOGIN_ROUTE);
  }
}
