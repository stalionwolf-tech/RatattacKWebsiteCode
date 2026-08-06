import { NextResponse } from 'next/server'
import { clientPromise, getConnectionInfo, ConfigError } from '@/lib/mongodb'

// MongoDB requires the Node.js runtime (not edge) and must never be cached.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Parse MONGO_URL with the WHATWG URL parser and return a credential-free
 * breakdown of the exact URI the runtime is using. Username/password are
 * masked before anything is returned so credentials never leave the server.
 *
 * Note: `new URL()` throws on standard `mongodb://host1,host2/...` URIs that
 * list multiple comma-separated hosts. We surface that as a parse error rather
 * than crashing so admins can see that the URI shape is non-SRV.
 */
function parseMongoUri(driverVersion: string, nodeVersion: string): Record<string, unknown> {
  const raw = process.env.MONGO_URL
  if (!raw) {
    return { parsed: false, error: 'MONGO_URL is not set.', mongodbDriverVersion: driverVersion, nodeVersion }
  }

  try {
    const url = new URL(process.env.MONGO_URL!)

    // Mask credentials before building the response.
    const hasUsername = Boolean(url.username)
    const hasPassword = Boolean(url.password)
    url.username = hasUsername ? '***' : ''
    url.password = hasPassword ? '***' : ''

    const searchParams: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      searchParams[key] = value
    })

    return {
      parsed: true,
      protocol: url.protocol, // e.g. "mongodb+srv:" or "mongodb:"
      hostname: url.hostname,
      pathname: url.pathname, // the default database, e.g. "/ratattack"
      searchParams,
      mongodbDriverVersion: driverVersion,
      nodeVersion,
      credentialsPresent: { username: hasUsername, password: hasPassword },
      credentialsMasked: true,
    }
  } catch (err) {
    return {
      parsed: false,
      error: err instanceof Error ? err.message : String(err),
      hint: 'new URL() cannot parse standard mongodb:// URIs with multiple comma-separated hosts. Atlas SRV URIs (mongodb+srv://) parse cleanly.',
    }
  }
}

/**
 * GET /api/admin/debug/mongo
 *
 * Returns a credential-free snapshot of the MongoDB connection: environment
 * info, the host being connected to, the exact URI options parsed, a safe
 * breakdown of the parsed MONGO_URL, and the live results of a ping + auth
 * check.
 */
export async function GET() {
  const info = getConnectionInfo()

  const payload: Record<string, unknown> = {
    nodeVersion: info.nodeVersion,
    driverVersion: info.driverVersion,
    host: info.host,
    tlsConfigured: info.tlsConfigured,
    uriOptions: info.uriOptions,
    uri: parseMongoUri(info.driverVersion, info.nodeVersion),
    ping: false,
    auth: false,
    connected: false,
  }

  try {
    const client = await clientPromise()
    payload.connected = true

    // Ping the deployment.
    await client.db(info.dbName).command({ ping: 1 })
    payload.ping = true

    // A successful authenticated command confirms auth.
    await client.db(info.dbName).command({ connectionStatus: 1 })
    payload.auth = true

    return NextResponse.json(payload, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    payload.error = message
    payload.configError = err instanceof ConfigError
    const status = err instanceof ConfigError ? 503 : 500
    return NextResponse.json(payload, { status })
  }
}
