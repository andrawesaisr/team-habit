import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../../config/env";
import * as schema from "./schema";

if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Please define it in your environment.");
}

const connection = postgres(env.DATABASE_URL, {
    prepare: false
});

export const db = drizzle(connection, { schema });
export type Database = typeof db;
