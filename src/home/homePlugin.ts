import { FastifyInstance } from "fastify";
import { PrismaClient, User } from "@prisma/client";
import { html, renderHtml } from "../web/html";
import layout from "../web/layout";

const createHomePlugin =
  ({ db }: { db: PrismaClient }) =>
  async (server: FastifyInstance) => {
    server.get("/", async (request, reply) => {
      // TODO setup plugins and dependencies to infer this
      const user = <User>request.session.get("user");
      reply.type("text/html").send(
        renderHtml(
          layout(
            { isAuthenticated: !!user },
            html`
              <h1 class="text-lg">Welcome</h1>
            `
          )
        )
      );
    });
  };

export default createHomePlugin;
