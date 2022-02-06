import { Stripe } from "stripe";

export default function createStripeClient() {
  return new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: "2020-08-27",
  });
}
