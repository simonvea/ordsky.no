export interface Env {
  DB: D1Database;
}

export type SessionResponse = {
  id: string;
  words: string[];
  cloud?: string;
  numberOfEntries: number;
  createdAt: string;
  updatedAt: string;
};

export type DbSession = {
  id: string;
  words: string;
  cloud_svg?: string;
  entries_count: number;
  created_at: string;
  updated_at: string;
};

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
