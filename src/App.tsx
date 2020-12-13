import React, { Suspense, lazy, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { CloudProvider } from './context/cloud/cloudContext';
import { Home } from './pages/Home';
import { FormsProvider } from './context/form/formsContext';
import { Spinner } from './components/Spinner';
import { WordsForm } from './pages/WordsForm';
import { TextForm } from './pages/TextForm';
import { About } from './pages/About';
import { TermsBanner } from './components/TermsBanner';
import { SessionPage } from './features/session/SessionPage';

const Visualization = lazy(() => import('./pages/Visualization'));
const SHOW_TERMS_KEY = 'displayedTerms';

const App: React.FC = function App() {
  const [showTerms, setShowTerms] = React.useState(true);

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
  return (
    <Router>
      <header className="header">
        <h1 className="header__title">
          <Link to="/">Ordsky.no</Link>
        </h1>
        <nav className="nav">
          <Link
            to="/form-input"
            className="button button--small"
            style={{ margin: '0 5px' }}
            role="button"
          >
            Ny Ordsky
          </Link>
          <Link
            to="/session"
            className="button button--small"
            style={{ margin: '0 5px' }}
            role="button"
          >
            Lag en felles ordsky
          </Link>
          <Link to="/about" className="nav__link">
            Om Ordsky.no
          </Link>
        </nav>
      </header>
      <main className="main-container">
        <CloudProvider>
          <FormsProvider>
            <Suspense fallback={<Spinner message="Laster side..." />}>
              <Switch>
                <Route path="/text-input" component={TextForm} />
                <Route path="/form-input" component={WordsForm} />
                <Route path="/visualization" component={Visualization} />
                <Route path="/about" component={About} />
                <Route path="/session" component={SessionPage} />
                <Route exact path="/" component={Home} />
              </Switch>
            </Suspense>
          </FormsProvider>
        </CloudProvider>
        {showTerms && <TermsBanner onClose={onCloseTerms} />}
      </main>
      <footer className="footer" />
    </Router>
  );
};

export { App };
