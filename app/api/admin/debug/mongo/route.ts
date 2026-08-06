import { NextResponse } from 'next/server'
import { clientPromise, getConnectionInfo, ConfigError } from '@/lib/mongodb'

// MongoDB requires the Node.js runtime (not edge) and must never be cached.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/debug/mongo
 *
 * Returns a credential-free snapshot of the MongoDB connection: environment
 * info, the host being connected to, the exact URI options parsed, and the
 * live results of a ping + auth check.
 */
export async function GET() {
  const info = getConnectionInfo()

  const payload: Record<string, unknown> = {
    nodeVersion: info.nodeVersion,
    driverVersion: info.driverVersion,
    host: info.host,
    tlsConfigured: info.tlsConfigured,
    uriOptions: info.uriOptions,
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
