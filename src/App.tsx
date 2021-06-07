import React, { Suspense, lazy } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
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
  const history = useHistory();

  const navigateToWordsPage = (): void => history.push('/words');
  const navigateToTextPage = (): void => history.push('/text');

  return (
    <>
      <OrdskyHeader />
      <Main>
        <ErrorBoundary>
          <WordsProvider>
            <TextProvider>
              <Suspense fallback={<Spinner message="Laster side..." />}>
                <Switch>
                  <Route path="/words">
                    <WordsPage onClickToTextForm={navigateToTextPage} />
                  </Route>
                  <Route path="/text">
                    <TextPage onClickToWordsForm={navigateToWordsPage} />
                  </Route>
                  <Route path="/collab">
                    <CollaborativePage />
                  </Route>
                  <Route path="/about">
                    <About />
                  </Route>
                  <Route path="/">
                    <Home onClickCreate={navigateToWordsPage} />
                  </Route>
                </Switch>
              </Suspense>
            </TextProvider>
          </WordsProvider>
        </ErrorBoundary>
      </Main>
    </>
  );
};

export { App };
