import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { App } from './App';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.querySelector('#root')!);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
