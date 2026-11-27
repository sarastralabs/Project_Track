import "server-only";

import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { UserRole } from "@sarastra/shared";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { MongoClient } from "mongodb";

import { env } from "./env";

const globalForAuth = globalThis as typeof globalThis & {
  mongoAuthClient?: MongoClient;
  authInstance?: ReturnType<typeof betterAuth>;
};

function getAuthMongoClient(): MongoClient {
  if (!globalForAuth.mongoAuthClient) {
    globalForAuth.mongoAuthClient = new MongoClient(env.MONGODB_URI);
  }
  return globalForAuth.mongoAuthClient;
}

function createAuth() {
  const client = getAuthMongoClient();
  const db = client.db(env.MONGODB_DB_NAME);
  return betterAuth({
    appName: "Sarastra Hub",
    baseURL: env.APP_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          defaultValue: UserRole.OWNER,
          input: false,
        },
        clientId: {
          type: "string",
          required: false,
          defaultValue: null,
          input: false,
        },
        deactivatedAt: {
          type: "string",
          required: false,
          defaultValue: null,
          input: false,
        },
      },
    },
    plugins: [bearer()],
  });
}

export const auth = globalForAuth.authInstance ?? createAuth();
globalForAuth.authInstance = auth;