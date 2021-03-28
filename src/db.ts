import { createConnection } from "typeorm";
import ormconfig from "./ormconfig";

export const connect = async () => {
  return await createConnection(<any>ormconfig);
};
