import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { CloudProvider } from './context/cloud/cloudContext';
import { Home } from './pages/Home';
import { FormsProvider } from './context/form/formsContext';
import { Spinner } from './components/Spinner';
import { WordsForm } from './pages/WordsForm';
import { TextForm } from './pages/TextForm';

const Visualization = lazy(() => import('./pages/Visualization'));

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
                <Route path="/text-input" component={TextForm} />
                <Route path="/form-input" component={WordsForm} />
                <Route path="/visualization" component={Visualization} />
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
