import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';
import { dom } from '@fortawesome/fontawesome-svg-core';
import { App } from './App';

// Routes whose first render needs no URL params or network data. The live and
// collect sessions are left to the client-only shell.
export const prerenderRoutes = [
  '/',
  '/words',
  '/text',
  '/create',
  '/felles',
  '/about',
  '/contact',
];

export type RenderedPage = {
  head: string;
  html: string;
};

export function render(url: string): RenderedPage {
  const sheet = new ServerStyleSheet();
  try {
    const html = renderToString(
      sheet.collectStyles(
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      )
    );
    // FontAwesome injects its CSS at runtime; without it icons render huge
    // until the bundle loads.
    const head = `<style>${dom.css()}</style>${sheet.getStyleTags()}`;
    return { head, html };
  } finally {
    sheet.seal();
  }
}
