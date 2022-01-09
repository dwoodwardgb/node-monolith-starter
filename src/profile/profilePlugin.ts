import { FastifyInstance } from "fastify";
import * as di from "awilix";
import { PrismaClient } from ".prisma/client";
import { html, renderHtml } from "../web/html";
import layout from "../web/layout";
import { ensureAuthenticatedGuard } from "../auth/authPlugin";

const createProfilePlugin =
  ({ db }: { db: PrismaClient }) =>
  async (server: FastifyInstance) => {
    server.get(
      "/",
      {
        preHandler: ensureAuthenticatedGuard,
      },
      async (request, reply) => {
        const { userId } = request.session.get("user");
        const user = await db.user.findUnique({
          where: { userId },
          include: { addresses: true },
        });
        reply.type("text/html").send(
          renderHtml(
            layout(
              { isAuthenticated: !!user },
              html`
                <section>
                  <h1>Profile for ${user.nickname}</h1>
                  <div>email: ${user.email}</div>
                  ${user.addresses.length > 0
                    ? html`<section>
                        <h2>Addresses</h2>
                        <ul>
                          ${user.addresses.map((a) => html`<li>${a.city}</li>`)}
                        </ul>
                      </section>`
                    : ""}
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
