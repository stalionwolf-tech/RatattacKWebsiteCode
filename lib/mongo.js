import { MongoClient } from 'mongodb';

/**
 * Shared MongoDB connection.
 *
 * A single cached client/db is reused across route handlers and server
 * components so we never open a new connection on every request (which would
 * exhaust the connection pool in a serverless environment).
 *
 * The connection promise is cached on `globalThis` so it survives module
 * re-evaluation during dev hot-reloads.
 */

const globalForMongo = globalThis;

export async function getDb() {
  const uri = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME || 'ratattack';

  if (!uri) {
    throw new Error('MONGO_URL is not configured.');
  }

  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri);
    globalForMongo._mongoClientPromise = client.connect();
  }

  const client = await globalForMongo._mongoClientPromise;
  return client.db(dbName);
}
