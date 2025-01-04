import { DbSession, SessionResponse } from './felles';
export interface Env {
  DB: D1Database;
}

const dbSessionToSessionResponse = (dbSession: DbSession): SessionResponse => ({
  id: dbSession.id,
  words: JSON.parse(dbSession.words),
  cloud: dbSession.cloud,
  numberOfEntries: dbSession.entries_count,
  createdAt: dbSession.created_at,
  updatedAt: dbSession.updated_at,
});

export const onRequestPut = async (
  context: EventContext<Env, 'path', { words?: string[]; cloud?: string }>
): Promise<Response> => {
  const [id, attribute] = context.params.path;

  if (id.length !== 5) return new Response('Invalid id', { status: 400 });

  const { DB } = context.env;
  const data = await context.request.json();

  if (!Array.isArray(data)) {
    return new Response('Invalid data, expected a list. Got ' + typeof data, {
      status: 400,
    });
  }

  switch (attribute) {
    case 'words': {
      const session = await DB.prepare(
        'SELECT words FROM sessions WHERE id = ?'
      )
        .bind(id)
        .first<{ words: string }>();

      let result: SessionResponse;

      if (!session) {
        const words = JSON.stringify(data);
        const { results } = await DB.prepare(
          'INSERT INTO sessions (id, words, entries_count) VALUES (?, ?, ?) RETURNING *'
        )
          .bind(id, words, 1)
          .run<DbSession>();

        result = dbSessionToSessionResponse(results[0]);
      } else {
        const existingWords = JSON.parse(session.words);

        const newList = [...existingWords, ...data];

        const json = JSON.stringify(newList);

        const { results } = await DB.prepare(
          "UPDATE sessions SET words = ?, entries_count = entries_count + 1, updated_at = datetime('now') WHERE id = ? RETURNING *"
        )
          .bind(json, id)
          .run<DbSession>();

        result = dbSessionToSessionResponse(results[0]);
      }

      return new Response(JSON.stringify(result));
    }

    case 'cloud': {
      const session = await DB.prepare('SELECT * FROM sessions WHERE id = ?')
        .bind(id)
        .first<DbSession>();

      if (!session) {
        return new Response('Session not found', { status: 404 });
      }

      let result: SessionResponse;

      const json = JSON.stringify(data);

      const { results } = await DB.prepare(
        'UPDATE sessions SET cloud = ? WHERE id = ? RETURNING *'
      )
        .bind(json, id)
        .run<DbSession>();

      result = dbSessionToSessionResponse(results[0]);

      return new Response(JSON.stringify(result));
    }

    default: {
      return new Response('Invalid attribute', { status: 400 });
    }
  }
};
