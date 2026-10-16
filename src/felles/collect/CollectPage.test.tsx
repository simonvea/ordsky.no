import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { CollectPage } from './CollectPage';

jest.mock('./services/collectBaseUrl', () => ({
  collectBaseUrl: '/api/felles',
}));

// Drawing the cloud needs canvas/d3, which jsdom lacks; this page only decides whether it shows.
jest.mock('../../common/organisms/CloudDisplay', () => ({
  CloudDisplay: (): React.ReactElement => <div>ordsky-tegning</div>,
}));

jest.mock('../../common/hooks/useCallToAction', () => ({
  useCallToAction: () => ({
    shouldDisplayCallToAction: false,
    incrementCloudCount: jest.fn(),
  }),
}));

const sessionWithCloud = {
  id: 'abcde',
  words: ['hei', 'hallo', 'hei'],
  numberOfEntries: 3,
  cloud: [{ text: 'HEI', size: 40 }],
  wordCount: [{ text: 'HEI', count: 2 }],
  createdAt: '2026-09-01 10:00:00',
  updatedAt: '2026-09-01 10:05:00',
};

const { cloud: _cloud, wordCount: _wordCount, ...sessionWithoutCloud } =
  sessionWithCloud;

const respond = (status: number, body?: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    // HTTP/2, which production uses, has no reason phrase
    statusText: '',
    json: async () => body,
  }) as Response;

const originalFetch = globalThis.fetch;

const stubFetch = (
  onDelete: () => Promise<Response> = async () =>
    respond(200, sessionWithoutCloud)
): jest.Mock<Promise<Response>, [string, RequestInit?]> => {
  const fetch = jest.fn<Promise<Response>, [string, RequestInit?]>(
    async (_url, init) =>
      init?.method === 'DELETE' ? onDelete() : respond(200, sessionWithCloud)
  );
  globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
  return fetch;
};

const renderPage = (path: string): void => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/felles/innsamling/:id" element={<CollectPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CollectPage', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('given a session where the cloud is already made', () => {
    it('when the admin views it, then a button to collect more words explains that the cloud is deleted and the answers are kept', async () => {
      // Arrange
      stubFetch();

      // Act
      renderPage('/felles/innsamling/abcde?admin=true');

      // Assert
      const button = await screen.findByRole('button', {
        name: 'Samle inn flere ord',
      });
      expect(button).toHaveAccessibleDescription(
        'Ordskyen slettes, men alle innsendte svar beholdes (3 så langt). Du lager en ny ordsky når du har samlet inn flere ord.'
      );
    });

    it('when a participant views it, then there is no button to collect more words', async () => {
      // Arrange
      stubFetch();

      // Act
      renderPage('/felles/innsamling/abcde');

      // Assert
      await screen.findByText('ordsky-tegning');
      expect(
        screen.queryByRole('button', { name: 'Samle inn flere ord' })
      ).not.toBeInTheDocument();
    });

    it('when the admin clicks collect more words, then the cloud is cleared and the wait screen shows the answers so far', async () => {
      // Arrange
      const fetch = stubFetch();
      renderPage('/felles/innsamling/abcde?admin=true');
      const button = await screen.findByRole('button', {
        name: 'Samle inn flere ord',
      });

      // Act
      fireEvent.click(button);

      // Assert
      expect(await screen.findByText('3 har lagt inn ord.')).toBeInTheDocument();
      expect(screen.queryByText('ordsky-tegning')).not.toBeInTheDocument();
      expect(fetch).toHaveBeenCalledWith('/api/felles/abcde/cloud', {
        method: 'DELETE',
      });
    });

    it('when the admin clicks collect more words and the server fails, then the error shows the status code', async () => {
      // Arrange
      stubFetch(async () => respond(500));
      renderPage('/felles/innsamling/abcde?admin=true');
      const button = await screen.findByRole('button', {
        name: 'Samle inn flere ord',
      });

      // Act
      fireEvent.click(button);

      // Assert
      expect(
        await screen.findByText(
          'Noe gikk galt i forsøket på å åpne innsamlingen igjen: 500'
        )
      ).toBeInTheDocument();
    });

    it('when the admin clicks collect more words and the network fails, then an error is shown instead of a stuck spinner', async () => {
      // Arrange
      stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));
      renderPage('/felles/innsamling/abcde?admin=true');
      const button = await screen.findByRole('button', {
        name: 'Samle inn flere ord',
      });

      // Act
      fireEvent.click(button);

      // Assert
      expect(
        await screen.findByText(/Noe gikk galt i forsøket på å åpne innsamlingen igjen/)
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Åpner innsamlingen igjen...')
      ).not.toBeInTheDocument();
    });
  });
});
