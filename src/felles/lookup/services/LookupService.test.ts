import { lookupSession } from './LookupService';

const collectUrl = '/api/felles';
const liveUrl = '/api/collaborative';

const session = {
  id: 'abcde',
  words: ['hei', 'hallo'],
  numberOfEntries: 2,
  createdAt: '2026-09-01 10:00:00',
  updatedAt: '2026-09-01 10:05:00',
};

const respond = (status: number, body?: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: String(status),
    json: async () => body,
  }) as Response;

const originalFetch = globalThis.fetch;

// Unknown URLs answer 404, same as the API does for a missing session
const stubFetch = (
  responses: Record<string, Response>
): jest.Mock<Promise<Response>, [string]> => {
  const fetch = jest.fn(async (url: string) => responses[url] ?? respond(404));
  globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
  return fetch;
};

describe('lookupSession', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('given a collect session with the id exists', () => {
    it('when looking up the id, then one collect hit is returned', async () => {
      // Arrange
      stubFetch({
        '/api/felles/abcde': respond(200, session),
      });

      // Act
      const result = await lookupSession({ id: 'abcde', collectUrl, liveUrl });

      // Assert
      expect(result).toEqual({
        type: 'found',
        hits: [{ kind: 'collect', session }],
      });
    });
  });

  describe('given a live session with the id exists', () => {
    it('when looking up the id in lowercase, then the live endpoint is called with uppercase', async () => {
      // Arrange
      const fetch = stubFetch({
        '/api/collaborative/ABCDE': respond(200, { ...session, id: 'ABCDE' }),
      });

      // Act
      const result = await lookupSession({ id: 'abcde', collectUrl, liveUrl });

      // Assert
      expect(fetch).toHaveBeenCalledWith('/api/collaborative/ABCDE');
      expect(result).toEqual({
        type: 'found',
        hits: [{ kind: 'live', session: { ...session, id: 'ABCDE' } }],
      });
    });
  });

  describe('given no session with the id exists', () => {
    it('when looking up the id, then no hits are returned', async () => {
      // Arrange
      stubFetch({});

      // Act
      const result = await lookupSession({ id: 'abcde', collectUrl, liveUrl });

      // Assert
      expect(result).toEqual({ type: 'found', hits: [] });
    });
  });

  describe('given one endpoint fails with a server error', () => {
    it('when looking up the id, then an error naming the endpoint and status is returned', async () => {
      // Arrange
      stubFetch({
        '/api/felles/abcde': respond(500),
      });

      // Act
      const result = await lookupSession({ id: 'abcde', collectUrl, liveUrl });

      // Assert
      expect(result).toEqual({
        type: 'error',
        message: 'GET /api/felles/abcde svarte 500',
      });
    });
  });

  describe('given the id has surrounding whitespace', () => {
    it('when looking up the id, then the whitespace is ignored', async () => {
      // Arrange
      const fetch = stubFetch({});

      // Act
      await lookupSession({ id: '  abcde ', collectUrl, liveUrl });

      // Assert
      expect(fetch).toHaveBeenCalledWith('/api/felles/abcde');
    });
  });
});
