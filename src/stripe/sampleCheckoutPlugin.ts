import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { Stripe } from "stripe";
import { PrismaClient, User } from "@prisma/client";

import layout from "../web/layout";
import { html, renderHtml } from "../web/html";
import { USER_SESSION_FIELD_NAME } from "../auth/authPlugin";

const ONE_DOLLAR_IN_CENTS = 100;

const createSampleCheckoutPlugin =
  ({ stripeClient, db }: { stripeClient: Stripe; db: PrismaClient }) =>
  async (server: FastifyInstance) => {
    server.get("/checkout", async (request, reply) => {
      // 1. create paymentIntent in Stripe
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: ONE_DOLLAR_IN_CENTS,
        currency: "usd",
      });

      // 2. persist paymentIntent in our DB
      await db.payment.create({ data: { paymentId: paymentIntent.id } });

      // 3. render payment form with payment intent
      const user = <User>request.session.get(USER_SESSION_FIELD_NAME);
      reply.type("text/html").send(
        renderHtml(
          layout(
            {
              isAuthenticated: !!user,
              scripts: [
                "https://js.stripe.com/v3/",
                "/public/sample-checkout.js",
              ],
            },
            html`
              <h1 class="text-2xl">Checkout</h1>
              <form
                id="checkout-form"
                class="space-y-4"
                action="/checkout"
                method="POST"
              >
                <input
                  type="hidden"
                  name="payment_intent_id"
                  id="payment_intent_id"
                  value="${paymentIntent.id}"
                />
                <input
                  type="hidden"
                  name="payment_intent_secret"
                  id="payment_intent_secret"
                  value="${paymentIntent.client_secret}"
                />
                <div id="card-errors" class="text-red-500"></div>
                <div id="payment-card-element" style="max-width:400px;"></div>
                <button
                  type="submit"
                  class="border-solid border-black border-2 text-lg p-2"
                >
                  Pay
                </button>
              </form>
            `
          )
        )
      );
    });

    const checkoutFormSchema = Type.Object({
      payment_intent_id: Type.String(),
    });
    server.post<{ Body: Static<typeof checkoutFormSchema> }>(
      "/checkout",
      { schema: { body: checkoutFormSchema } },
      async (request, reply) => {
        reply.redirect(`/receipts/${request.body.payment_intent_id}`);
      }
    );

    const receiptsParamSchema = Type.Object({
      paymentId: Type.String(),
    });
    server.get<{ Params: Static<typeof receiptsParamSchema> }>(
      "/receipts/:paymentId",
      { schema: { params: receiptsParamSchema } },
      async (request, reply) => {
        const payment = await db.payment.findFirst({
          where: { paymentId: request.params.paymentId },
        });

        const user = <User>request.session.get(USER_SESSION_FIELD_NAME);
        reply.type("text/html").send(
          renderHtml(
            layout(
              {
                isAuthenticated: !!user,
                scripts: [
                  "https://js.stripe.com/v3/",
                  "/public/sample-checkout.js",
                ],
              },
              html`
                <p>Thanks for shopping with us!</p>
                <p>
                  ${payment.completed
                    ? "Your order has been processed."
                    : "We are still processing your order, refresh the page to see your progress!"}
                </p>
              `
            )
          )
        );
      }
    );
  };

export default createSampleCheckoutPlugin;
