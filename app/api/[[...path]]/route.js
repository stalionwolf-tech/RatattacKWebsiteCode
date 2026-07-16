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

    if (route === 'discord-widget') {
      const GUILD_ID = '1527162295011115088';
      try {
        const r = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/widget.json`, {
          next: { revalidate: 30 },
          headers: { 'User-Agent': 'RatAttackSite/1.0' },
        });
        if (!r.ok) {
          return cors(NextResponse.json({ ok: false, error: `Discord ${r.status}` }, { status: 200 }));
        }
        const data = await r.json();
        return cors(NextResponse.json({
          ok: true,
          name: data.name || '',
          presence_count: typeof data.presence_count === 'number' ? data.presence_count : null,
          instant_invite: data.instant_invite || null,
        }));
      } catch (e) {
        return cors(NextResponse.json({ ok: false, error: e.message }, { status: 200 }));
      }
    }

    if (route === 'videos') {
      const CHANNEL_ID = 'UCro3AjNRHR1Jbd-P2IVztFA';
      const CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`;
      const decode = (s) => s
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>');

      // === Attempt 1: YouTube Data API v3 (most reliable if key set) ===
      const API_KEY = process.env.YOUTUBE_API_KEY;
      if (API_KEY) {
        try {
          // Uploads playlist id = replace 'UC' -> 'UU'
          const uploadsPlaylistId = 'UU' + CHANNEL_ID.slice(2);
          const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=12&key=${API_KEY}`;
          const r = await fetch(url, { next: { revalidate: 1800 } });
          if (r.ok) {
            const data = await r.json();
            const videos = (data.items || []).map((item) => {
              const sn = item.snippet || {};
              const vid = sn.resourceId?.videoId || item.contentDetails?.videoId;
              const thumbs = sn.thumbnails || {};
              return {
                id: vid,
                title: sn.title || '',
                published: sn.publishedAt || '',
                description: (sn.description || '').slice(0, 240),
                thumbnail: (thumbs.maxres || thumbs.standard || thumbs.high || thumbs.medium || thumbs.default || {}).url || `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
                url: `https://www.youtube.com/watch?v=${vid}`,
              };
            }).filter((v) => v.id);
            if (videos.length) {
              return cors(NextResponse.json({ source: 'data-api', channelId: CHANNEL_ID, channelUrl: CHANNEL_URL, count: videos.length, videos }));
            }
          }
        } catch (_) { /* fall through */ }
      }

      // === Attempt 2: RSS feed (works from most public hosts, no key needed) ===
      try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        const resp = await fetch(feedUrl, {
          next: { revalidate: 1800 },
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RatAttackBot/1.0)' },
        });
        if (resp.ok) {
          const xml = await resp.text();
          if (xml.includes('<entry>')) {
            const entries = xml.split('<entry>').slice(1);
            const videos = entries.map((entry) => {
              const pick = (re) => (entry.match(re) || [, ''])[1];
              const videoId = pick(/<yt:videoId>([^<]+)<\/yt:videoId>/);
              const title = decode(pick(/<title>([^<]+)<\/title>/));
              const published = pick(/<published>([^<]+)<\/published>/);
              const description = decode(pick(/<media:description>([\s\S]*?)<\/media:description>/)).trim();
              const views = pick(/views="(\d+)"/);
              return {
                id: videoId,
                title,
                published,
                description: description.slice(0, 240),
                views: Number(views) || 0,
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                url: `https://www.youtube.com/watch?v=${videoId}`,
              };
            }).filter((v) => v.id);
            if (videos.length) {
              return cors(NextResponse.json({ source: 'rss', channelId: CHANNEL_ID, channelUrl: CHANNEL_URL, count: videos.length, videos }));
            }
          }
        }
      } catch (_) { /* fall through */ }

      // === Attempt 3: Fallback video IDs via oEmbed (last resort for dev previews) ===
      const fallbackIds = (process.env.YOUTUBE_FALLBACK_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (fallbackIds.length) {
        const videos = await Promise.all(fallbackIds.map(async (id) => {
          try {
            const oe = await fetch(`https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D${id}&format=json`);
            if (!oe.ok) throw new Error('oembed fail');
            const j = await oe.json();
            return {
              id,
              title: j.title,
              published: '',
              description: '',
              thumbnail: j.thumbnail_url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
              url: `https://www.youtube.com/watch?v=${id}`,
            };
          } catch {
            return { id, title: 'RatAttacK Video', published: '', description: '', thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, url: `https://www.youtube.com/watch?v=${id}` };
          }
        }));
        return cors(NextResponse.json({ source: 'oembed-fallback', channelId: CHANNEL_ID, channelUrl: CHANNEL_URL, count: videos.length, videos }));
      }

      // Nothing worked
      return cors(NextResponse.json({
        source: 'none',
        channelId: CHANNEL_ID,
        channelUrl: CHANNEL_URL,
        count: 0,
        videos: [],
        note: 'YouTube feed unreachable from this host. Set YOUTUBE_API_KEY or YOUTUBE_FALLBACK_IDS env var, or deploy to production where RSS is typically accessible.',
      }));
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
