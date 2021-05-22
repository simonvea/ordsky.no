import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Home } from './home';
import { Spinner } from './common/molecules/Spinner';
import { TermsBanner } from './common/organisms/TermsBanner';
import { OrdskyHeader } from './common/molecules/Header';
import { ErrorBoundary } from './common/organisms/ErrorBoundary';
import { Main } from './common/atoms/Main';
import { WordsPage, WordsProvider } from './words';
import { TextPage, TextProvider } from './text';
import { About } from './about';

const CollaborativePage = lazy(() => import('./collaborative'));

const SHOW_TERMS_KEY = 'displayedTerms';

const App: React.FC = function App() {
  const [showTerms, setShowTerms] = React.useState(true);
  const history = useHistory();

  const today = new Date();

  useEffect(() => {
    const showedTerms = localStorage.getItem(SHOW_TERMS_KEY);
    if (showedTerms) {
      setShowTerms(false);
    }
  }, []);

  const onCloseTerms: () => void = () => {
    setShowTerms(false);
    localStorage.setItem(SHOW_TERMS_KEY, today.toISOString());
  };

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
          {showTerms && <TermsBanner onClose={onCloseTerms} />}
        </ErrorBoundary>
      </Main>
    </>
  );
};

export { App };
