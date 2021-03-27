import { createConnection } from "typeorm";

export const connect = async () => {
  return await createConnection();
};
