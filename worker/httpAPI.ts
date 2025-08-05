// HTTP API handlers for /api/felles/* endpoints
// Converted from Pages Functions to Workers

export type SessionResponse = {
  id: string;
  words: string[];
  numberOfEntries: number;
  cloud?: string;
  wordCount?: { text: string; count: number }[];
  createdAt: string;
  updatedAt: string;
};

export type DbSession = {
  id: string;
  words: string;
  entries_count: number;
  cloud?: string;
  word_count?: string;
  created_at: string;
  updated_at: string;
};

export const dbSessionToSessionResponse = (
  dbSession: DbSession
): SessionResponse => ({
  id: dbSession.id,
  words: JSON.parse(dbSession.words),
  cloud: dbSession.cloud ? JSON.parse(dbSession.cloud) : undefined,
  wordCount: dbSession.word_count ? JSON.parse(dbSession.word_count) : undefined,
  numberOfEntries: dbSession.entries_count,
  createdAt: dbSession.created_at,
  updatedAt: dbSession.updated_at,
});

// Route: GET /api/felles/:id - Get session by ID
export async function handleGetSession(request: Request, env: any, sessionId: string): Promise<Response> {
  try {
    const { DB } = env;

    const session = await DB.prepare('SELECT * FROM sessions WHERE id = ?')
      .bind(sessionId)
      .first();

    if (!session) {
      return new Response('Session not found', { status: 404 });
    }

    return new Response(JSON.stringify(dbSessionToSessionResponse(session)), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Route: PATCH /api/felles/:id - Update session
export async function handleUpdateSession(request: Request, env: any, sessionId: string): Promise<Response> {
  try {
    const body = await request.json();
    
    if (!body || typeof body !== 'object') {
      return new Response('Invalid body', { status: 400 });
    }

    const { DB } = env;

    const updates: string[] = [];
    const values: unknown[] = [];

    if ('words' in body) {
      updates.push('words = ?');
      values.push(JSON.stringify(body.words));
    }
    if ('wordCount' in body) {
      updates.push('word_count = ?');
      values.push(JSON.stringify(body.wordCount));
    }
    if ('cloud' in body) {
      updates.push('cloud = ?');
      values.push(JSON.stringify(body.cloud));
    }
    if ('numberOfEntries' in body) {
      updates.push('entries_count = ?');
      values.push(body.numberOfEntries);
    }

    if (!updates.length) {
      return new Response('No valid fields to update', { status: 400 });
    }

    const sql = `UPDATE sessions SET ${updates.join(', ')} WHERE id = ? RETURNING *`;
    values.push(sessionId);

    const { results } = await DB.prepare(sql)
      .bind(...values)
      .run();

    if (!results || !results.length) {
      return new Response('Session not found', { status: 404 });
    }

    return new Response(JSON.stringify(dbSessionToSessionResponse(results[0])), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Route: PUT /api/felles/:id/:attribute - Add words or update cloud
export async function handleAddToSession(request: Request, env: any, sessionId: string, attribute: string): Promise<Response> {
  try {
    if (sessionId.length !== 5) {
      return new Response('Invalid id', { status: 400 });
    }

    const { DB } = env;
    const data = await request.json();

    if (!Array.isArray(data)) {
      return new Response('Invalid data, expected a list. Got ' + typeof data, {
        status: 400,
      });
    }

    switch (attribute) {
      case 'words': {
        // Check if session exists
        const session = await DB.prepare('SELECT words FROM sessions WHERE id = ?')
          .bind(sessionId)
          .first();

        let result: SessionResponse;

        if (!session) {
          // Create new session
          const words = JSON.stringify(data);
          const { results } = await DB.prepare(
            'INSERT INTO sessions (id, words, entries_count) VALUES (?, ?, ?) RETURNING *'
          )
            .bind(sessionId, words, 1)
            .run();

          result = dbSessionToSessionResponse(results[0]);
        } else {
          // Update existing session
          const existingWords = JSON.parse(session.words);
          const newList = [...existingWords, ...data];
          const json = JSON.stringify(newList);

          const { results } = await DB.prepare(
            'UPDATE sessions SET words = ?, entries_count = entries_count + 1 WHERE id = ? RETURNING *'
          )
            .bind(json, sessionId)
            .run();

          result = dbSessionToSessionResponse(results[0]);
        }

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case 'cloud': {
        const session = await DB.prepare('SELECT * FROM sessions WHERE id = ?')
          .bind(sessionId)
          .first();

        if (!session) {
          return new Response('Session not found', { status: 404 });
        }

        const json = JSON.stringify(data);
        const { results } = await DB.prepare(
          'UPDATE sessions SET cloud = ? WHERE id = ? RETURNING *'
        )
          .bind(json, sessionId)
          .run();

        const result = dbSessionToSessionResponse(results[0]);

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      default: {
        return new Response('Invalid attribute', { status: 400 });
      }
    }
  } catch (error) {
    console.error('Error adding to session:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Main HTTP API router
export async function handleHttpAPI(request: Request, env: any, url: URL): Promise<Response> {
  const method = request.method;
  const pathSegments = url.pathname.split('/').filter(Boolean); // ['api', 'felles', ...]
  
  // Expected paths: /api/felles/:id or /api/felles/:id/:attribute
  if (pathSegments.length < 3 || pathSegments[0] !== 'api' || pathSegments[1] !== 'felles') {
    return new Response('Not Found', { status: 404 });
  }

  const sessionId = pathSegments[2];
  const attribute = pathSegments[3];

  try {
    switch (method) {
      case 'GET':
        if (attribute) {
          return new Response('Method not allowed', { status: 405 });
        }
        return handleGetSession(request, env, sessionId);

      case 'PATCH':
        if (attribute) {
          return new Response('Method not allowed', { status: 405 });
        }
        return handleUpdateSession(request, env, sessionId);

      case 'PUT':
        if (!attribute) {
          return new Response('Attribute required for PUT', { status: 400 });
        }
        return handleAddToSession(request, env, sessionId, attribute);

      default:
        return new Response('Method not allowed', { 
          status: 405,
          headers: { 'Allow': 'GET, PATCH, PUT' }
        });
    }
  } catch (error) {
    console.error('HTTP API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}