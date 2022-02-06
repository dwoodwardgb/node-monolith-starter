import fastify from "fastify";
import * as di from "awilix";
import fastifySecureSession from "fastify-secure-session";
import fastifyBlipp from "fastify-blipp";
import fastifyStatic from "fastify-static";
import path from "path";
import fastifyFormBody from "fastify-formbody";

const diContainer = di.createContainer();

diContainer.loadModules(
  [
    "./auth/authPlugin.js",
    "./db.js",
    "./auth/onUserAuthenticated.js",
    "./home/homePlugin.js",
    "./profile/profilePlugin.js",
    "./stripe/stripeClient.js",
    "./stripe/sampleCheckoutPlugin.js",
    "./stripe/stripePlugin.js",
  ],
  {
    cwd: __dirname,
    resolverOptions: {
      register: di.asFunction,
      lifetime: di.Lifetime.SINGLETON,
    },
  }
);

const server = fastify({ logger: { level: "debug" } });

server.register(fastifyBlipp);

server.register(fastifySecureSession, {
  key: Buffer.from(process.env.SESSION_SECRET_HEX, "hex"),
});

server.register(fastifyFormBody);

export async function startServer() {
  const {
    homePlugin,
    authPlugin,
    profilePlugin,
    sampleCheckoutPlugin,
    stripePlugin,
  } = diContainer.cradle;
  server.register(homePlugin);
  server.register(authPlugin);
  server.register(profilePlugin, { prefix: "/profile" });
  server.register(sampleCheckoutPlugin);
  server.register(stripePlugin);

  server.register(fastifyStatic, {
    root: path.join(__dirname, "..", "public"),
    prefix: "/public/",
  });

  try {
    await server.listen(process.env.PORT, "0.0.0.0");
    server.blipp();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
