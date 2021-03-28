/*
 * This file exists because we needed to dynamically map DATABASE_URL to the url prop
 * IF heroku could simply specify TYPEORM_URL instead of DATABASE_URL we could use pure
 * .env files, but alas. Regardless this is an ok way of showing which props are for
 * production and which are for development
 */

import { ConnectionOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

// super spicy TS magic from SO https://stackoverflow.com/questions/42214743/declare-a-clone-function-to-make-readonly-properties-writable-in-typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type ConfigType = Mutable<Partial<PostgresConnectionOptions>>;

const base: ConfigType = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  cli: {
    migrationsDir: "dist/migrations",
  },
  entities: ["dist/**/*-entity.js"],
  migrations: ["dist/migrations/**/*.js"],
};

const environments: Record<string, ConfigType> = {
  development: {
    logging: true,
  },
  production: {
    logging: false,
    extra: {
      ssl: { rejectUnauthorized: false },
    },
  },
};

const env = process.env.NODE_ENV || "development";

export default <ConnectionOptions>{
  ...base,
  ...environments[env],
};
