import * as di from "awilix";
import { PrismaClient } from "@prisma/client";

function createDb(): PrismaClient {
  return new PrismaClient();
}

createDb[di.RESOLVER] = {
  register: di.asFunction,
  dispose: (db: PrismaClient) => db.$disconnect,
  lifetime: di.Lifetime.SINGLETON,
};

export default createDb;
