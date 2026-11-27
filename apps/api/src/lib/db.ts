import "server-only";

import { connectMongo, getMongoConnection } from "@sarastra/db";

import { env } from "./env";

/** Connect using validated env; safe to call on every request (cached). */
export async function connectDb() {
  return connectMongo(env.MONGODB_URI, env.MONGODB_DB_NAME);
}

export function isDbConnected(): boolean {
  return getMongoConnection()?.connection.readyState === 1;
}
