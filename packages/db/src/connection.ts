import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

/**
 * Connect once and reuse.
 * In Next.js dev, modules re-evaluate on hot reload — without this cache
 * we would open a new Mongo connection on every reload and exhaust the pool.
 */
export async function connectMongo(uri: string, dbName: string): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
    } as mongoose.ConnectOptions);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export function getMongoConnection(): typeof mongoose | null {
  return cache.conn;
}

export async function disconnectMongo(): Promise<void> {
  if (cache.conn) {
    await mongoose.disconnect();
    cache.conn = null;
    cache.promise = null;
  }
}
