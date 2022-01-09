import fastify from "fastify";
import * as di from "awilix";
import fastifySecureSession from "fastify-secure-session";
import path from "path";
import fs from "fs";
import fastifyBlipp from "fastify-blipp";

const diContainer = di.createContainer();

diContainer.loadModules(
  [
    "./auth/authPlugin.js",
    "./db.js",
    "./auth/onUserAuthenticated.js",
    "./home/homePlugin.js",
    "./profile/profilePlugin.js",
  ],
  {
    cwd: __dirname,
  }
);

const server = fastify({ logger: { level: "debug" } });

server.register(fastifyBlipp);

server.register(fastifySecureSession, {
  key: fs.readFileSync(path.join(__dirname, "..", "session-secret-key")),
});

export async function startServer() {
  const { homePlugin, authPlugin, profilePlugin } = diContainer.cradle;
  server.register(homePlugin);
  server.register(authPlugin);
  server.register(profilePlugin, { prefix: "/profile" });

  try {
    await server.listen(3000);
    server.blipp();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
