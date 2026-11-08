const MAX_NOTE = 240;
const MAX_LIMIT = 20;
const DEFAULT_LIMIT = 5;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': '86400'
};

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};

let schemaPromise;

async function ensureSchema(env) {
  if (!schemaPromise) {
    schemaPromise = env.DB.batch([
      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
          note TEXT NOT NULL CHECK (length(trim(note)) BETWEEN 1 AND ${MAX_NOTE}),
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        )
      `),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS reviews_created_at ON reviews (created_at DESC)')
      ,
      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS counters (
          name TEXT PRIMARY KEY,
          value INTEGER NOT NULL DEFAULT 0
        )
      `)
    ])
      .then(() => true)
      .catch(error => {
        schemaPromise = null;
        throw error;
      });
  }

  await schemaPromise;
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, ...JSON_HEADERS, ...extra }
  });
}

function parseLimit(value) {
  const limit = Number.parseInt(value || '', 10);
  if (!Number.isFinite(limit)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, limit));
}

function parseBody(body) {
  const stars = Number(body?.stars);
  const note = typeof body?.note === 'string' ? body.note.replace(/\s+/g, ' ').trim() : '';

  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return { error: 'Choose a star rating from 1 to 5.' };
  }
  if (note.length < 1) {
    return { error: 'Write a short note for the pit wall.' };
  }
  if (note.length > MAX_NOTE) {
    return { error: `Keep the note to ${MAX_NOTE} characters.` };
  }

  return { stars, note };
}

async function handleVisits(request, env) {
  if (request.method === 'GET') {
    const row = await env.DB.prepare("SELECT value FROM counters WHERE name = 'pageviews'").first();
    return json({ visits: Number(row?.value) || 0 });
  }

  if (request.method === 'POST') {
    const row = await env.DB.prepare(`
      INSERT INTO counters (name, value) VALUES ('pageviews', 1)
      ON CONFLICT(name) DO UPDATE SET value = value + 1
      RETURNING value
    `).first();

    if (!row) {
      return json({ error: 'The view counter could not record that visit.' }, 500);
    }

    return json({ visits: Number(row.value) || 0 });
  }

  return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST, OPTIONS' });
}

async function handleRequest(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  await ensureSchema(env);

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path === '/' || path === '/api/health') {
    return json({ ok: true, service: 'turbotutor-reviews' });
  }

  if (path === '/api/visits') {
    return handleVisits(request, env);
  }

  if (path !== '/api/reviews') {
    return json({ error: 'Not found.' }, 404);
  }

  if (request.method === 'GET') {
    const limit = parseLimit(url.searchParams.get('limit'));
    const { results } = await env.DB.prepare(`
      SELECT id, stars, note, created_at AS createdAt
      FROM reviews
      ORDER BY created_at DESC, id DESC
      LIMIT ?
    `)
      .bind(limit)
      .all();

    return json({ reviews: results || [] });
  }

  if (request.method === 'POST') {
    const raw = await request.text();
    if (raw.length > 4096) {
      return json({ error: 'That note is too large.' }, 413);
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: 'Send the review as JSON.' }, 400);
    }

    const parsed = parseBody(body);
    if (parsed.error) {
      return json({ error: parsed.error }, 422);
    }

    const review = await env.DB.prepare(`
      INSERT INTO reviews (stars, note)
      VALUES (?, ?)
      RETURNING id, stars, note, created_at AS createdAt
    `)
      .bind(parsed.stars, parsed.note)
      .first();

    if (!review) {
      return json({ error: 'The pit wall could not save that note.' }, 500);
    }

    return json({ review }, 201);
  }

  return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST, OPTIONS' });
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error('Pit wall request failed', error);
      return json({ error: 'The pit wall is unavailable right now.' }, 500);
    }
  }
};
