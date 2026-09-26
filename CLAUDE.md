# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a React word cloud application (ordsky.no) built with TypeScript, using MVP pattern with atomic design principles.

### Collaborative Features

Two separate collaboration backends exist:

- Collaborative sessions (`/felles`) — REST-only via `/api/felles/*`
- Real-time collaborative sessions — WebSocket + REST via `/api/collaborative/*` and Socket.IO at `/ws`

### Code Style Requirements

- Atomic design component organization
- MVP pattern: Page components act as presenters, Services handle business logic

### Deployment

- **Frontend**: Deployed as a static site (built via `npm run build`, served by nginx on VPS)
- **Backend**: Runs in Docker/docker-compose on the same VPS (`../ordsky.no-api`), managed from this repo's `docker-compose.yml`
- **Reverse proxy**: nginx routes `/api/*` and `/ws` to the backend container, serves static frontend files
- **CI/CD**: GitHub Actions builds and deploys via `rsync` over SSH (no third-party actions) — see `.github/workflows/deploy.yml`

### Environment Variables

- `.env.local` — gitignored, create locally to test against production backend:
  ```
  VITE_SESSION_WEBSOCKET_URL=https://www.ordsky.no/ws
  VITE_SESSION_API_URL=https://www.ordsky.no/api/collaborative
  VITE_COLLECT_BASE_URL=https://www.ordsky.no/api/felles
  ```
- Production build uses GitHub Actions vars (`SESSION_WEBSOCKET_URL`, `SESSION_API_URL`, `COLLECT_BASE_URL`) set to the relative paths in `.env`

### Development Notes

- Run the backend locally with `npm run dev` in `../ordsky.no-api` before starting the frontend
- `npm ci` requires `.npmrc` with `legacy-peer-deps=true` — several ESLint plugins have stale peer dep declarations for ESLint v10
