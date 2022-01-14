import { FastifyInstance } from "fastify";
import * as di from "awilix";
import { PrismaClient, User } from ".prisma/client";
import { html, renderHtml } from "../web/html";
import layout from "../web/layout";

const createHomePlugin =
  ({ db }: { db: PrismaClient }) =>
  async (server: FastifyInstance) => {
    server.get("/", async (request, reply) => {
      const user = <User>request.session.get("user");
      reply.type("text/html").send(
        renderHtml(
          layout(
            { isAuthenticated: !!user },
            html`
              <h1 class="text-lg">Products</h1>
              <ul class="flex space-x-8"></ul>
            `
          )
        )
      );
    });
  };

createHomePlugin[di.RESOLVER] = {
  register: di.asFunction,
  lifetime: di.Lifetime.SINGLETON,
};

export default createHomePlugin;
