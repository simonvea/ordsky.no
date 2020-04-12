import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { CloudProvider } from './context/cloud/cloudContext';
import { Home } from './pages/Home';
import { Input } from './pages/Input';
import { FormsProvider } from './context/form/formsContext';
import { Spinner } from './components/Spinner';

const WordCloud = lazy(() => import('./pages/Cloud'));

const App: React.FC = function App() {
  // TODO: Add link to homepage in header
  return (
    <div>
      <header className="header">
        <h1 className="header__title">Ordsky.no</h1>
      </header>
      <main className="main-container">
        <CloudProvider>
          <FormsProvider>
            <Router>
              <Suspense fallback={<Spinner message="Laster side..." />}>
                <Route exact path="/" component={Home} />
                <Route path="/input" component={Input} />
                <Route path="/ordsky" component={WordCloud} />
              </Suspense>
            </Router>
          </FormsProvider>
        </CloudProvider>
      </main>
      <footer className="footer" />
    </div>
  );
};

export { App };
