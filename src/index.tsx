import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router';
import '@fontsource/anton/latin-400.css';
import './index.css';
import { App } from './App';

const container = document.querySelector('#root')!;
const app = (
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

// Prerendered routes arrive with markup to hydrate; the spa.html fallback is
// empty and needs a fresh render.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
