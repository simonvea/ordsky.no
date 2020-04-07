import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { WordsProvider } from './context/wordsContext';
import { Home } from './pages/Home';
import { TextForm } from './pages/Form';

const App: React.FC = function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header__title">Ordsky.no</h1>
      </header>
      <main className="main-container">
        <WordsProvider>
          <Router>
            <Route exact path="/" component={Home} />
            <Route path="/ordsky" component={TextForm} />
          </Router>
        </WordsProvider>
      </main>
      <footer className="footer" />
    </div>
  );
};

export { App };
