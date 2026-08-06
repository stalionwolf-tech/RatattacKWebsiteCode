import { MongoClient } from 'mongodb';
import { createRequire } from 'module';
import dns from 'dns';

/**
 * Production-grade MongoDB connection layer for the Mystery Pack Manager.
 *
 * Responsibilities:
 *  - Validate configuration (MONGO_URL, DB_NAME) with catchable errors.
 *  - Maintain a single shared, cached MongoClient (survives dev hot-reloads).
 *  - Log a redacted connection banner (never credentials).
 *  - Classify connection failures into actionable categories.
 *  - Provide a full diagnostics suite (DNS, ping, read, write, latency...).
 */

const DEFAULT_DB_NAME = 'ratattack';
const SERVER_SELECTION_TIMEOUT_MS = 8000;

const dnsp = dns.promises;
const globalForMongo = globalThis;

/** Raised when required configuration is missing. */
export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
    this.code = 'CONFIG';
  }
}

/** Resolve the installed mongodb driver version (best effort). */
export function getDriverVersion() {
  try {
    const require = createRequire(import.meta.url);
    return require('mongodb/package.json').version;
  } catch {
    return 'unknown';
  }
}

/**
 * Remove any credentials embedded in a connection string or error message so
 * they never reach logs or API responses.
 */
export function redactSecrets(value) {
  if (value == null) return value;
  return String(value).replace(
    /(mongodb(?:\+srv)?:\/\/)([^@/\s]+)@/gi,
    '$1****:****@',
  );
}

/**
 * Extract just the host portion of a connection string (no credentials, no
 * database, no query string). Safe to log.
 */
export function extractHost(uri) {
  if (!uri) return null;
  const afterProto = uri.replace(/^mongodb(\+srv)?:\/\//i, '');
  const afterAuth = afterProto.includes('@')
    ? afterProto.slice(afterProto.indexOf('@') + 1)
    : afterProto;
  return afterAuth.split(/[/?]/)[0] || null;
}

/** Validate and read MongoDB configuration from the environment. */
export function getMongoConfig() {
  const uri = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;

  if (!uri) {
    return { ok: false, error: 'Missing MONGO_URL environment variable.' };
  }
  if (!dbName) {
    return { ok: false, error: 'Missing DB_NAME environment variable.' };
  }
  return { ok: true, uri, dbName, isSrv: /^mongodb\+srv:/i.test(uri) };
}

/**
 * Classify a MongoDB/driver error into an actionable category. Never includes
 * raw credentials in the details.
 *
 * Categories: configuration | invalid_connection_string | authentication |
 * tls | dns | network_restriction | timeout | network | unknown
 */
export function classifyMongoError(err) {
  const raw = redactSecrets(err?.message || String(err || 'Unknown error'));
  const name = err?.name || '';
  const code = err?.code;
  const codeName = err?.codeName;
  const lower = raw.toLowerCase();

  if (err instanceof ConfigError || code === 'CONFIG') {
    return {
      category: 'configuration',
      message: 'A required MongoDB environment variable is missing.',
      recommendation:
        'Add MONGO_URL (and optionally DB_NAME) to your project environment variables, then redeploy.',
      details: raw,
    };
  }

  if (
    name === 'MongoParseError' ||
    lower.includes('invalid connection string') ||
    lower.includes('invalid scheme') ||
    lower.includes('uri must')
  ) {
    return {
      category: 'invalid_connection_string',
      message: 'The MongoDB connection string is invalid.',
      recommendation:
        'Check MONGO_URL. It must start with mongodb:// or mongodb+srv:// and any special characters in the password must be URL-encoded.',
      details: raw,
    };
  }

  if (
    code === 18 ||
    code === 8000 ||
    codeName === 'AuthenticationFailed' ||
    lower.includes('authentication failed') ||
    lower.includes('bad auth') ||
    lower.includes('auth error')
  ) {
    return {
      category: 'authentication',
      message: 'MongoDB authentication failed.',
      recommendation:
        'Verify the username and password in MONGO_URL and that the database user exists with access to this database.',
      details: raw,
    };
  }

  if (
    lower.includes('tls') ||
    lower.includes('ssl') ||
    lower.includes('certificate') ||
    lower.includes('handshake') ||
    lower.includes('alert number')
  ) {
    return {
      category: 'tls',
      message: 'The TLS/SSL handshake with MongoDB failed.',
      recommendation:
        'For MongoDB Atlas use the mongodb+srv:// URI (TLS on by default). Ensure your Node/driver TLS settings and any custom CA are correct.',
      details: raw,
    };
  }

  if (
    code === 'ENOTFOUND' ||
    code === 'EAI_AGAIN' ||
    lower.includes('getaddrinfo') ||
    lower.includes('querysrv') ||
    lower.includes('enotfound') ||
    lower.includes('failed to look up srv')
  ) {
    return {
      category: 'dns',
      message: 'DNS lookup for the MongoDB host failed.',
      recommendation:
        'Check the cluster hostname in MONGO_URL for typos and confirm the SRV DNS records resolve from this network.',
      details: raw,
    };
  }

  if (name === 'MongoServerSelectionError' || lower.includes('server selection')) {
    // Atlas IP allowlist blocks usually surface as a server-selection timeout
    // (no server ever becomes reachable).
    return {
      category: 'network_restriction',
      message: 'Could not reach any MongoDB server (server selection timed out).',
      recommendation:
        'This is most often an Atlas IP allowlist issue. In Atlas → Network Access add your server IP (or 0.0.0.0/0 for testing), and confirm the cluster is running.',
      details: raw,
    };
  }

  if (
    code === 'ETIMEDOUT' ||
    lower.includes('timed out') ||
    lower.includes('timeout')
  ) {
    return {
      category: 'timeout',
      message: 'The MongoDB connection timed out.',
      recommendation:
        'Verify network connectivity and the Atlas IP allowlist. If the cluster is slow to wake, retry, or raise serverSelectionTimeoutMS.',
      details: raw,
    };
  }

  if (
    code === 'ECONNREFUSED' ||
    code === 'ECONNRESET' ||
    lower.includes('connection refused') ||
    lower.includes('econnreset')
  ) {
    return {
      category: 'network',
      message: 'The network connection to MongoDB was refused or reset.',
      recommendation:
        'Confirm the host and port are correct, the cluster is running, and no firewall/IP allowlist is blocking this environment.',
      details: raw,
    };
  }

  return {
    category: 'unknown',
    message: 'An unexpected MongoDB error occurred.',
    recommendation: 'Review the error details below and consult the MongoDB logs.',
    details: raw,
  };
}

/** Log a one-time, credential-free connection banner. */
function logBanner(cfg) {
  console.log('[MongoDB]');
  console.log('Node version:', process.version);
  console.log('MongoDB driver version:', getDriverVersion());
  console.log('Database name:', cfg.dbName);
  console.log('Connection string host:', extractHost(cfg.uri));
}

/**
 * Connect to MongoDB and return `{ client, db }` using a single cached client.
 * Throws `ConfigError` when configuration is missing; other errors are the
 * raw driver errors (classify them with `classifyMongoError`).
 */
export async function connectToDatabase() {
  const cfg = getMongoConfig();
  if (!cfg.ok) {
    throw new ConfigError(cfg.error);
  }

  if (!globalForMongo._mongoClientPromise) {
    logBanner(cfg);
    const client = new MongoClient(cfg.uri, {
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
    });
    globalForMongo._mongoClientPromise = client
      .connect()
      .then((connected) => {
        console.log('[MongoDB] Connected.');
        return connected;
      })
      .catch((err) => {
        // Allow a later request to retry from scratch.
        globalForMongo._mongoClientPromise = undefined;
        const info = classifyMongoError(err);
        console.error(`[MongoDB] Connection failed (${info.category}): ${info.message}`);
        throw err;
      });
  }

  const client = await globalForMongo._mongoClientPromise;
  const db = client.db(cfg.dbName);
  return { client, db };
}

/** Convenience helper that returns just the database handle. */
export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

/* ------------------------------------------------------------------ */
/* Diagnostics                                                         */
/* ------------------------------------------------------------------ */

const PACKS_COLLECTION = 'mystery_pack_runs';
const DIAG_COLLECTION = '_diagnostics';

function step(id, label, pass, info, extra = {}) {
  return { id, label, pass, info, ...extra };
}

function failFrom(id, label, err) {
  const info = classifyMongoError(err);
  return step(id, label, false, info.message, {
    category: info.category,
    recommendation: info.recommendation,
    details: info.details,
  });
}

/**
 * Run a full battery of connection diagnostics and return a structured report.
 * Every step is isolated so one failure still yields results for the others.
 * Secrets are never included in the output.
 */
export async function runDiagnostics() {
  const startedAt = Date.now();
  const steps = [];

  // 1. Environment variables present
  const cfg = getMongoConfig();
  if (!cfg.ok) {
    steps.push(
      step('env', 'Environment variables present', false, cfg.error, {
        category: 'configuration',
        recommendation:
          'Add MONGO_URL (and optionally DB_NAME) to your project environment variables.',
      }),
    );
    return summarize(steps, startedAt, { host: null, dbName: null });
  }
  steps.push(
    step(
      'env',
      'Environment variables present',
      true,
      `MONGO_URL set · DB_NAME = "${cfg.dbName}"`,
    ),
  );

  const host = extractHost(cfg.uri);

  // 2. DNS lookup test
  try {
    if (cfg.isSrv) {
      const records = await dnsp.resolveSrv(`_mongodb._tcp.${host}`);
      steps.push(
        step('dns', 'DNS lookup test', true, `Resolved ${records.length} SRV record(s) for ${host}`),
      );
    } else {
      const hostname = host.split(',')[0].split(':')[0];
      const { address } = await dnsp.lookup(hostname);
      steps.push(step('dns', 'DNS lookup test', true, `${hostname} → ${address}`));
    }
  } catch (err) {
    steps.push(failFrom('dns', 'DNS lookup test', err));
  }

  // 3. MongoDB ping (also establishes the connection)
  let db = null;
  try {
    const t0 = Date.now();
    const conn = await connectToDatabase();
    db = conn.db;
    await db.command({ ping: 1 });
    const ms = Date.now() - t0;
    steps.push(step('ping', 'MongoDB ping', true, `Ping succeeded in ${ms} ms`, { latencyMs: ms }));
  } catch (err) {
    steps.push(failFrom('ping', 'MongoDB ping', err));
  }

  // Steps 4-7 require a live connection.
  if (!db) {
    const skip = 'Skipped — no MongoDB connection.';
    steps.push(step('read', 'Read test', false, skip, { category: 'network' }));
    steps.push(step('write', 'Write test', false, skip, { category: 'network' }));
    steps.push(step('collection', 'Collection existence', false, skip, { category: 'network' }));
    steps.push(step('latency', 'Atlas connection latency', false, skip, { category: 'network' }));
    return summarize(steps, startedAt, { host, dbName: cfg.dbName });
  }

  // 4. Read test + collection cache
  let collections = [];
  try {
    collections = await db.listCollections().toArray();
    steps.push(
      step('read', 'Read test', true, `Listed ${collections.length} collection(s)`),
    );
  } catch (err) {
    steps.push(failFrom('read', 'Read test', err));
  }

  // 5. Write test (insert + delete in an isolated diagnostics collection)
  try {
    const col = db.collection(DIAG_COLLECTION);
    const res = await col.insertOne({ kind: 'diagnostics', ts: new Date() });
    await col.deleteOne({ _id: res.insertedId });
    steps.push(step('write', 'Write test', true, 'Insert + delete round-trip succeeded'));
  } catch (err) {
    steps.push(failFrom('write', 'Write test', err));
  }

  // 6. Collection existence (mystery_pack_runs)
  try {
    const names = collections.length
      ? collections.map((c) => c.name)
      : (await db.listCollections().toArray()).map((c) => c.name);
    const exists = names.includes(PACKS_COLLECTION);
    steps.push(
      step(
        'collection',
        'Collection existence',
        true,
        exists
          ? `"${PACKS_COLLECTION}" exists`
          : `"${PACKS_COLLECTION}" not created yet (created automatically on first save)`,
        { warn: !exists },
      ),
    );
  } catch (err) {
    steps.push(failFrom('collection', 'Collection existence', err));
  }

  // 7. Atlas connection latency (averaged ping)
  try {
    const samples = [];
    for (let i = 0; i < 3; i += 1) {
      const t0 = Date.now();
      // eslint-disable-next-line no-await-in-loop
      await db.command({ ping: 1 });
      samples.push(Date.now() - t0);
    }
    const avg = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
    steps.push(
      step('latency', 'Atlas connection latency', true, `Average ${avg} ms over ${samples.length} pings`, {
        latencyMs: avg,
      }),
    );
  } catch (err) {
    steps.push(failFrom('latency', 'Atlas connection latency', err));
  }

  return summarize(steps, startedAt, { host, dbName: cfg.dbName });
}

function summarize(steps, startedAt, meta) {
  const failed = steps.filter((s) => !s.pass);
  const firstFailure = failed[0] || null;
  return {
    success: failed.length === 0,
    durationMs: Date.now() - startedAt,
    host: meta.host,
    dbName: meta.dbName,
    driverVersion: getDriverVersion(),
    nodeVersion: process.version,
    steps,
    failedCount: failed.length,
    category: firstFailure?.category || null,
    recommendation: firstFailure?.recommendation || null,
  };
}
