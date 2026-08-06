import { MongoClient } from 'mongodb';

/**
 * Shared MongoDB connection helper for the Mystery Pack Manager (and any other
 * server code that needs the database).
 *
 * Goals:
 *  - Reuse a single cached client across route handlers / server components so
 *    we never exhaust the connection pool in a serverless environment.
 *  - Cache the connection promise on `globalThis` so it survives module
 *    re-evaluation during dev hot-reloads (avoids duplicate connections).
 *  - Fail with a *descriptive, catchable* error when configuration is missing,
 *    so API routes can respond with friendly JSON instead of crashing / HTML.
 */

const DEFAULT_DB_NAME = 'ratattack';

const globalForMongo = globalThis;

/**
 * Raised when a required environment variable is missing. Route handlers can
 * detect this via `err instanceof ConfigError` (or `err.code === 'CONFIG'`)
 * and return a friendly 503 with setup instructions.
 */
export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
    this.code = 'CONFIG';
  }
}

/**
 * Validate and read the MongoDB configuration from the environment.
 * Returns `{ ok: true, uri, dbName }` when valid, otherwise
 * `{ ok: false, error }` with a human-readable reason.
 *
 * MONGO_URL is required. DB_NAME is optional and defaults to "ratattack" to
 * match the rest of the application.
 */
export function getMongoConfig() {
  const uri = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;

  if (!uri) {
    return { ok: false, error: 'Missing MONGO_URL environment variable.' };
  }
  if (!dbName) {
    return { ok: false, error: 'Missing DB_NAME environment variable.' };
  }
  return { ok: true, uri, dbName };
}

/**
 * Connect to MongoDB and return `{ client, db }`.
 * Throws a `ConfigError` if configuration is missing.
 */
export async function connectToDatabase() {
  const cfg = getMongoConfig();
  if (!cfg.ok) {
    throw new ConfigError(cfg.error);
  }

  if (!globalForMongo._mongoClientPromise) {
    console.log('[MysteryPack] Connecting to MongoDB...');
    const client = new MongoClient(cfg.uri);
    globalForMongo._mongoClientPromise = client
      .connect()
      .then((connected) => {
        console.log('[MysteryPack] Connected.');
        return connected;
      })
      .catch((err) => {
        // Clear the cached promise so a later request can retry the connection.
        globalForMongo._mongoClientPromise = undefined;
        throw err;
      });
  }

  const client = await globalForMongo._mongoClientPromise;
  const db = client.db(cfg.dbName);
  return { client, db };
}

/**
 * Convenience helper that returns just the database handle.
 * (MongoDB creates the database and any collection lazily on first write, so
 * there is nothing to "create" ahead of time.)
 */
export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}
