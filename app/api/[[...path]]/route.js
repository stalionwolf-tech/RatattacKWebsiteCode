import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

let client;
let db;

async function getDb() {
  if (db) return db;
  const uri = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME || 'ratattack';
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

function cors(res) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET(request, { params }) {
  const resolved = await params;
  const path = resolved?.path || [];
  const route = path.join('/');

  try {
    if (route === '' || route === 'health') {
      return cors(NextResponse.json({ status: 'ok', service: 'ratattack-api' }));
    }

    if (route === 'contact/messages') {
      const database = await getDb();
      const list = await database
        .collection('contact_messages')
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
      return cors(NextResponse.json({ messages: list }));
    }

    return cors(NextResponse.json({ error: 'Not found' }, { status: 404 }));
  } catch (e) {
    return cors(NextResponse.json({ error: e.message }, { status: 500 }));
  }
}

export async function POST(request, { params }) {
  const resolved = await params;
  const path = resolved?.path || [];
  const route = path.join('/');

  try {
    const body = await request.json().catch(() => ({}));

    if (route === 'contact') {
      const { name, email, subject, message } = body || {};
      if (!name || !email || !message) {
        return cors(NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 }));
      }
      const database = await getDb();
      const { randomUUID } = await import('crypto');
      const doc = {
        id: randomUUID(),
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        subject: String(subject || '').slice(0, 300),
        message: String(message).slice(0, 5000),
        createdAt: new Date().toISOString(),
      };
      await database.collection('contact_messages').insertOne(doc);
      return cors(NextResponse.json({ ok: true, id: doc.id }));
    }

    return cors(NextResponse.json({ error: 'Not found' }, { status: 404 }));
  } catch (e) {
    return cors(NextResponse.json({ error: e.message }, { status: 500 }));
  }
}
