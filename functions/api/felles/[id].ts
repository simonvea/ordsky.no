import { DbSession, SessionResponse } from './felles';

export interface Env {
  DB: D1Database;
}

const dbSessionToSessionResponse = (dbSession: DbSession): SessionResponse => ({
  id: dbSession.id,
  words: JSON.parse(dbSession.words),
  cloud: dbSession.cloud_svg,
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
