// Writes one static HTML file per route into build/, so crawlers and first
// paint get real markup. Runs after the client and SSR builds.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const buildDir = path.resolve('build');
const { render, prerenderRoutes } = await import(
  path.resolve('build-server/entry-server.js')
);

const template = await readFile(path.join(buildDir, 'index.html'), 'utf8');

// nginx falls back to this for routes that are not prerendered, e.g.
// /felles/innsamling/:id, which the client renders from scratch.
await writeFile(path.join(buildDir, 'spa.html'), template);

for (const route of prerenderRoutes) {
  const { head, html } = render(route);
  const page = template
    .replace('</head>', `${head}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const dir = path.join(buildDir, route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), page);
  console.log(`prerendered ${route}`);
}
