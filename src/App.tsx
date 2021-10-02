import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Home } from './home';
import { Spinner } from './common/molecules/Spinner';
import { OrdskyHeader } from './common/molecules/Header';
import { ErrorBoundary } from './common/organisms/ErrorBoundary';
import { Main } from './common/atoms/Main';
import { WordsPage, WordsProvider } from './words';
import { TextPage, TextProvider } from './text';
import { About } from './about';
import { CookieBanner } from './common/molecules/CookieBanner';

const CollaborativePage = lazy(() => import('./collaborative'));

const SHOW_TERMS_KEY = 'displayedTerms';

const App: React.FC = function App() {
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const hasAccepted = JSON.parse(localStorage.getItem(SHOW_TERMS_KEY) || '');

    const now = new Date();

    const timeSince = now - new Date(hasAccepted.date);

    if (!hasAccepted?.accepted) {
      setShowCookies(true);
    }
  }, []);

  const history = useHistory();

  const navigateToWordsPage = (): void => history.push('/words');
  const navigateToTextPage = (): void => history.push('/text');

  const startAnalytics = (): void => {
    localStorage.setItem(
      SHOW_TERMS_KEY,
      JSON.stringify({ accepted: true, date: new Date().toISOString() })
    );
    setShowCookies(false);
    // start analytics
  };
  const stopAnalytics = (): void => {
    localStorage.setItem(
      SHOW_TERMS_KEY,
      JSON.stringify({ accepted: false, date: new Date().toISOString() })
    );
    setShowCookies(false);
  };

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
        {showCookies && (
          <CookieBanner
            onAcceptCookies={startAnalytics}
            onDeclineCookies={stopAnalytics}
          />
        )}
      </Main>
    </>
  );
};

export { App };
