import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Home } from './home';
import { Spinner } from './common/molecules/Spinner';
import { OrdskyHeader } from './common/molecules/Header';
import { ErrorBoundary } from './common/organisms/ErrorBoundary';
import { Main } from './common/atoms/Main';
import { WordsPage, WordsProvider } from './words';
import { TextPage, TextProvider } from './text';
import { About } from './about';
import { SessionProvider } from './collaborative/state/SessionProvider';
import { CallToActionProvider } from './common/state/CallToActionContext';

const CollaborativePage = lazy(() => import('./collaborative'));

const App: React.FC = function App() {
  return (
    <>
      <OrdskyHeader />
      <Main>
        <ErrorBoundary>
          <CallToActionProvider>
            <WordsProvider>
              <TextProvider>
                <SessionProvider>
                  <Suspense fallback={<Spinner message="Laster side..." />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="words" element={<WordsPage />} />
                      <Route path="text" element={<TextPage />} />
                      <Route path="collab" element={<CollaborativePage />} />
                      <Route path="about" element={<About />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Suspense>
                </SessionProvider>
              </TextProvider>
            </WordsProvider>
          </CallToActionProvider>
        </ErrorBoundary>
      </Main>
    </>
  );
};

export { App };
