import { FastifyInstance } from "fastify";
import { Stripe } from "stripe";
import { Static, Type } from "@sinclair/typebox";
import { PrismaClient } from "@prisma/client";

const webhookBodySchema = Type.String();

const createStripePlugin =
  ({ stripeClient, db }: { stripeClient: Stripe; db: PrismaClient }) =>
  async (server: FastifyInstance) => {
    // passes on the raw body so it can be checksum verified
    server.addContentTypeParser(
      "application/json",
      { parseAs: "buffer" },
      function rawBodyParser(_request, body, done) {
        done(null, body);
      }
    );

    server.post<{ Body: Static<typeof webhookBodySchema> }>(
      "/stripe/events",
      async (request, reply) => {
        const signature = request.headers["stripe-signature"];

        let event: Stripe.Event;

        try {
          event = stripeClient.webhooks.constructEvent(
            request.body,
            signature,
            process.env.STRIPE_SIGNING_SECRET
          );
        } catch (err) {
          reply.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }

        // Handle the event
        switch (event.type) {
          case "payment_intent.succeeded":
            const paymentIntent = <Stripe.PaymentIntent>event.data.object;
            try {
              await db.payment.update({
                where: { paymentId: paymentIntent.id },
                data: { completed: true },
              });
            } catch (e) {
              // TODO something sensible
              console.error(e);
            }
            break;
          case "payment_method.attached":
            const paymentMethod = event.data.object;
            console.log("PaymentMethod was attached to a Customer!");
            break;
          // ... handle other event types
          default:
            console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        reply.send(JSON.stringify({ received: true }));
      }
    );
  };

export default createStripePlugin;
