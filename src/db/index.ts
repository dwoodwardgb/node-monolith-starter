import { createConnection } from "typeorm";
import ormconfig from "./ormconfig";

export async function connect() {
  return await createConnection(<any>ormconfig);
}
