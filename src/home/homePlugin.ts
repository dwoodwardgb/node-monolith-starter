import { FastifyInstance } from "fastify";
import * as di from "awilix";
import { PrismaClient } from ".prisma/client";
import { html, renderHtml } from "../web/html";
import layout from "../web/layout";

const createHomePlugin =
  ({ db }: { db: PrismaClient }) =>
  async (server: FastifyInstance) => {
    server.get("/", async (request, reply) => {
      const products = await db.item.findMany({
        where: { quantity: { gte: 1 } },
      });
      const user = request.session.get("user");
      reply.type("text/html").send(
        renderHtml(
          layout(
            { isAuthenticated: !!user },
            html`
              <h1 class="text-lg">Products</h1>
              <ul class="flex space-x-8">
                ${products.map(
                  (p) =>
                    html`<li
                      class="border-2 border-black border-solid block p-4"
                      style="width:150px;height:150px;"
                    >
                      <div>${p.name}</div>
                      <div>Price: $${p.priceInCents / 100}</div>
                      <div>In stock: ${p.quantity}</div>
                    </li>`
                )}
              </ul>
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
