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
import { SessionProvider } from './felles/collaborative/state/SessionProvider';
import { CallToActionProvider } from './common/state/CallToActionContext';
import { FellesPage } from './felles/FellesPage';
import { Contact } from './contact';
import { CreatePage } from './create/CreatePage';

const CollaborativePage = lazy(() => import('./felles/collaborative'));
const CollectPage = lazy(() => import('./felles/collect'));

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
                      <Route path="create" element={<CreatePage />} />
                      <Route path="felles">
                        <Route index element={<FellesPage />} />
                        <Route path="live" element={<CollaborativePage />} />
                        <Route
                          path="innsamling/:id"
                          element={<CollectPage />}
                        />
                        <Route
                          path="innsamling"
                          element={<Navigate to="/felles" />}
                        />
                      </Route>
                      <Route
                        // This is a legacy route and may be removed in the future
                        path="collab"
                        element={<Navigate to="/felles" />}
                      />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
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
