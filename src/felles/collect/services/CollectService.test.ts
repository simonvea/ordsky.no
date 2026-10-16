import { ApiError, clearCloud } from './CollectService';

jest.mock('./collectBaseUrl', () => ({ collectBaseUrl: '/api/felles' }));

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

const stubFetch = (
  response: Response
): jest.Mock<Promise<Response>, [string, RequestInit?]> => {
  const fetch = jest.fn<Promise<Response>, [string, RequestInit?]>(
    async () => response
  );
  globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
  return fetch;
};

describe('clearCloud', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('given the session exists', () => {
    it('when clearing the cloud, then DELETE is sent to the cloud endpoint and the session is returned', async () => {
      // Arrange
      const fetch = stubFetch(respond(200, session));

      // Act
      const result = await clearCloud('abcde');

      // Assert
      expect(fetch).toHaveBeenCalledWith('/api/felles/abcde/cloud', {
        method: 'DELETE',
      });
      expect(result).toEqual(session);
    });
  });

  describe('given the server answers 404', () => {
    it('when clearing the cloud, then an ApiError carrying the response is thrown', async () => {
      // Arrange
      const notFound = respond(404);
      stubFetch(notFound);

      // Act
      const result = clearCloud('abcde');

      // Assert
      await expect(result).rejects.toBeInstanceOf(ApiError);
      await expect(result).rejects.toMatchObject({ response: notFound });
    });
  });
});
