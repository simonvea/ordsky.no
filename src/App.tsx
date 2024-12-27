import React, { Suspense, lazy } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { Home } from './home';
import { Spinner } from './common/molecules/Spinner';
import { OrdskyHeader } from './common/molecules/Header';
import { ErrorBoundary } from './common/organisms/ErrorBoundary';
import { Main } from './common/atoms/Main';
import { WordsPage, WordsProvider } from './words';
import { TextPage, TextProvider } from './text';
import { About } from './about';

const CollaborativePage = lazy(() => import('./collaborative'));

const App: React.FC = function App() {
  const navigate = useNavigate();

  const navigateToWordsPage = (): Promise<void> | void => navigate('/words');
  const navigateToTextPage = (): Promise<void> | void => navigate('/text');

  return (
    <>
      <OrdskyHeader />
      <Main>
        <ErrorBoundary>
          <WordsProvider>
            <TextProvider>
              <Suspense fallback={<Spinner message="Laster side..." />}>
                <Routes>
                  <Route
                    path="/words"
                    element={
                      <WordsPage onClickToTextForm={navigateToTextPage} />
                    }
                  />
                  <Route
                    path="/text"
                    element={
                      <TextPage onClickToWordsForm={navigateToWordsPage} />
                    }
                  />
                  <Route path="/collab" element={<CollaborativePage />} />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/"
                    element={<Home onClickCreate={navigateToWordsPage} />}
                  />
                </Routes>
              </Suspense>
            </TextProvider>
          </WordsProvider>
        </ErrorBoundary>
      </Main>
    </>
  );
};

export { App };
