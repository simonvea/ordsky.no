import { DbSession, SessionResponse } from './felles';

export interface Env {
  DB: D1Database;
}

export const dbSessionToSessionResponse = (
  dbSession: DbSession
): SessionResponse => ({
  id: dbSession.id,
  words: JSON.parse(dbSession.words),
  cloud: JSON.parse(dbSession.cloud),
  wordCount: JSON.parse(dbSession.word_count),
  numberOfEntries: dbSession.entries_count,
  createdAt: dbSession.created_at,
  updatedAt: dbSession.updated_at,
});

export const onRequestGet = async (
  context: EventContext<Env, 'id', {}>
): Promise<Response> => {
  const id = context.params.id;

  const { DB } = context.env;

  const session = await DB.prepare('SELECT * FROM sessions WHERE id = ?')
    .bind(id)
    .first<DbSession>();

  if (!session) {
    return new Response('Session not found', { status: 404 });
  }

  return new Response(JSON.stringify(dbSessionToSessionResponse(session)));
};

export const onRequestPatch = async (context: EventContext<Env, 'id', {}>) => {
  const id = context.params.id;
  const body = await context.request.json?.();

  if (!body || typeof body !== 'object')
    return new Response('Invalid body', { status: 400 });

  const { DB } = context.env;

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

  if (!updates.length)
    return new Response('No valid fields to update', { status: 400 });

  const sql = `UPDATE sessions SET ${updates.join(', ')} WHERE id = ? RETURNING *`;
  values.push(id);

  const { results } = await DB.prepare(sql)
    .bind(...values)
    .run<DbSession>();

  if (!results || !results.length)
    return new Response('Session not found', { status: 404 });

  return new Response(JSON.stringify(dbSessionToSessionResponse(results[0])));
};
