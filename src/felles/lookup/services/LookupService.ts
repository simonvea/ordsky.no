import type { SessionState } from '../../collect/services/CollectService';

export type SessionKind = 'collect' | 'live';

export type LookupHit = { kind: SessionKind; session: SessionState };

export type LookupResult =
  | { type: 'found'; hits: LookupHit[] }
  | { type: 'error'; message: string };

type FetchOutcome =
  | { type: 'hit'; hit: LookupHit }
  | { type: 'missing' }
  | { type: 'error'; message: string };

const fetchSession = async (
  kind: SessionKind,
  url: string
): Promise<FetchOutcome> => {
  try {
    const response = await fetch(url);

    if (response.status === 404) return { type: 'missing' };

    if (!response.ok) {
      return { type: 'error', message: `GET ${url} svarte ${response.status}` };
    }

    const session: SessionState = await response.json();
    return { type: 'hit', hit: { kind, session } };
  } catch (error) {
    return { type: 'error', message: `GET ${url} feilet: ${String(error)}` };
  }
};

export const lookupSession = async ({
  id,
  collectUrl,
  liveUrl,
}: {
  id: string;
  collectUrl: string;
  liveUrl: string;
}): Promise<LookupResult> => {
  const trimmed = id.trim();

  // Collect ids are case-sensitive, while live ids are always stored uppercased
  const outcomes = await Promise.all([
    fetchSession('collect', `${collectUrl}/${trimmed}`),
    fetchSession('live', `${liveUrl}/${trimmed.toUpperCase()}`),
  ]);

  const firstError = outcomes.find((outcome) => outcome.type === 'error');
  if (firstError) return firstError;

  const hits = outcomes.flatMap((outcome) =>
    outcome.type === 'hit' ? [outcome.hit] : []
  );

  return { type: 'found', hits };
};
