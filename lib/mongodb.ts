import { MongoClient, type Db } from 'mongodb'
import { version as driverVersion } from 'mongodb/package.json'

/**
 * Official MongoDB Atlas connection pattern for the Node.js driver.
 *
 * Deliberately minimal:
 *   const client = new MongoClient(process.env.MONGO_URL!)
 *   await client.connect()
 *
 * We pass NO custom connection options. In particular we set NO TLS/SSL
 * options of any kind (tls, ssl, tlsAllowInvalidCertificates, tlsCAFile,
 * tlsCertificateKeyFile, secureProtocol, checkServerIdentity, rejectUnauthorized,
 * or a custom https.Agent). The driver negotiates TLS automatically from the
 * mongodb+srv:// connection string, exactly as MongoDB Atlas recommends.
 */

/** Thrown when required configuration is missing, so callers can catch it. */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigError'
  }
}

const DB_NAME = process.env.DB_NAME || 'ratattack'

/**
 * Strip credentials from a connection string so it is safe to log/return.
 * Never print the username or password.
 */
function safeHost(uri: string): string {
  try {
    const u = new URL(uri)
    return `${u.protocol}//${u.hostname}${u.pathname && u.pathname !== '/' ? u.pathname : ''}`
  } catch {
    return 'unparseable-uri'
  }
}

/** Extract the exact URI options (query string) being parsed — no secrets. */
function parseUriOptions(uri: string): Record<string, string> {
  try {
    const u = new URL(uri)
    const opts: Record<string, string> = {}
    u.searchParams.forEach((value, key) => {
      opts[key] = value
    })
    return opts
  } catch {
    return {}
  }
}

/**
 * Preserve a single MongoClient across dev hot-reloads / serverless invocations
 * by caching the connect() promise on the global object.
 */
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGO_URL
  if (!uri) {
    throw new ConfigError('Missing MONGO_URL environment variable.')
  }

  // Diagnostics logging (never prints credentials).
  console.log('[MongoDB] Node version:', process.version)
  console.log('[MongoDB] Driver version:', driverVersion)
  console.log('[MongoDB] Connecting to host:', safeHost(uri))
  console.log('[MongoDB] URI options parsed:', JSON.stringify(parseUriOptions(uri)))
  console.log('[MongoDB] Custom TLS configured:', false)

  // The entire connection setup — nothing more.
  const client = new MongoClient(uri)
  return client.connect()
}

/** The shared, singleton connection promise. */
export function clientPromise(): Promise<MongoClient> {
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = createClientPromise().catch((err) => {
      // Allow the next request to retry from a clean slate.
      globalForMongo._mongoClientPromise = undefined
      throw err
    })
  }
  return globalForMongo._mongoClientPromise
}

/** Connect and return `{ client, db }`. */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise()
  return { client, db: client.db(DB_NAME) }
}

/** Convenience helper returning just the database handle. */
export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}

/**
 * Classify a thrown error into a category + friendly message + recommendation.
 * Purely descriptive — it does NOT change how we connect (no TLS tuning).
 */
export function classifyMongoError(err: unknown): {
  category: string
  message: string
  recommendation: string
  details: string
} {
  const raw = err instanceof Error ? err.message : String(err)
  const lower = raw.toLowerCase()
  const code = (err as { code?: unknown })?.code
  const name = (err as { name?: string })?.name || ''

  if (err instanceof ConfigError) {
    return {
      category: 'configuration',
      message: 'MongoDB is not configured.',
      recommendation: 'Add MONGO_URL (and optionally DB_NAME) to your environment variables, then redeploy.',
      details: raw,
    }
  }
  if (name === 'MongoParseError' || lower.includes('invalid connection string')) {
    return {
      category: 'invalid_connection_string',
      message: 'The MongoDB connection string is invalid.',
      recommendation:
        'MONGO_URL must start with mongodb:// or mongodb+srv:// and any special characters in the password must be URL-encoded.',
      details: raw,
    }
  }
  if (code === 18 || lower.includes('authentication failed') || lower.includes('bad auth')) {
    return {
      category: 'authentication',
      message: 'MongoDB authentication failed.',
      recommendation: 'Verify the username and password in MONGO_URL and that the database user exists.',
      details: raw,
    }
  }
  if (lower.includes('tls') || lower.includes('ssl')) {
    return {
      category: 'tls',
      message: 'The TLS handshake with MongoDB failed.',
      recommendation:
        'Use the mongodb+srv:// URI from Atlas and let the driver negotiate TLS automatically. Ensure the deployment uses the Node.js runtime on Node 20+.',
      details: raw,
    }
  }
  if (code === 'ENOTFOUND' || lower.includes('getaddrinfo')) {
    return {
      category: 'dns',
      message: 'The MongoDB host could not be resolved.',
      recommendation: 'Check the cluster hostname in MONGO_URL for typos and confirm the SRV DNS records resolve.',
      details: raw,
    }
  }
  if (name === 'MongoServerSelectionError' || lower.includes('server selection')) {
    return {
      category: 'network_restriction',
      message: 'Could not reach any MongoDB server.',
      recommendation: 'In Atlas, allow access from anywhere (0.0.0.0/0) or add Vercel egress IPs to the IP access list.',
      details: raw,
    }
  }
  if (code === 'ETIMEDOUT' || lower.includes('timed out')) {
    return {
      category: 'timeout',
      message: 'The MongoDB connection timed out.',
      recommendation: 'Check the Atlas IP access list and that the cluster is running.',
      details: raw,
    }
  }
  if (code === 'ECONNREFUSED' || lower.includes('econnrefused')) {
    return {
      category: 'network',
      message: 'The MongoDB connection was refused.',
      recommendation: 'Confirm the host and port in MONGO_URL and that the server is reachable.',
      details: raw,
    }
  }
  return {
    category: 'unknown',
    message: raw || 'Unexpected MongoDB error.',
    recommendation: 'Check the server logs for the full stack trace.',
    details: raw,
  }
}

/** Connection metadata for the debug endpoint (safe to return to admins). */
export function getConnectionInfo() {
  const uri = process.env.MONGO_URL || ''
  return {
    nodeVersion: process.version,
    driverVersion,
    host: uri ? safeHost(uri) : null,
    tlsConfigured: false,
    uriOptions: parseUriOptions(uri),
    dbName: DB_NAME,
  }
}
