import { FastifyInstance } from "fastify";
import * as di from "awilix";
import { PrismaClient, User } from ".prisma/client";

import { html, renderHtml } from "../web/html";
import layout from "../web/layout";
import {
  ensureAuthenticatedGuard,
  USER_SESSION_FIELD_NAME,
} from "../auth/authPlugin";

const createProfilePlugin =
  ({ db }: { db: PrismaClient }) =>
  async (server: FastifyInstance) => {
    server.get(
      "/",
      {
        preHandler: ensureAuthenticatedGuard,
      },
      async (request, reply) => {
        const user = <User>request.session.get(USER_SESSION_FIELD_NAME);
        reply.type("text/html").send(
          renderHtml(
            layout(
              { isAuthenticated: !!user },
              html`
                <section>
                  <h1>Profile for ${user.nickname}</h1>
                  <div>email: ${user.email}</div>
                </section>
              `
            )
          )
        );
      }
    );
  };

createProfilePlugin[di.RESOLVER] = {
  register: di.asFunction,
  lifetime: di.Lifetime.SINGLETON,
};

export default createProfilePlugin;
