# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development

- `npm start` - Start development server with Vite
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run serve` - Preview production build locally

### Testing

- `npm test` - Run Jest tests
- `npm run watch` - Run tests in watch mode

### Code Quality

- `npm run lint` - Run ESLint on src files
- `npm run lint-fix` - Run ESLint with auto-fix
- `npm run check` - Run both TypeScript check and linting

## Architecture

This is a React word cloud application (ordsky.no) built with TypeScript, using MVP pattern with atomic design principles.

### Core Features

- **Word Cloud Generation**: Uses D3.js and d3-cloud to create interactive word clouds from text input
- **Multiple Input Methods**:
  - Manual word entry (`/words`)
  - Text analysis (`/text`)
  - Collaborative sessions (`/felles`) — REST-only via `/api/felles/*`
  - Real-time collaborative sessions — WebSocket + REST via `/api/collaborative/*` and Socket.IO at `/ws`

### Project Structure

```
src/
├── common/           # Shared components and logic
│   ├── atoms/       # Pure UI components (Button, Input, etc.)
│   ├── molecules/   # Composed UI components (Header, WordsInput, etc.)
│   ├── organisms/   # Complex UI sections (CloudDisplay, ErrorBoundary)
│   ├── core/        # Business logic (createCloud, countWords, etc.)
│   ├── hooks/       # Custom React hooks and reducers
│   └── state/       # Global state management (Context providers)
├── [feature]/       # Feature-specific folders (words, text, felles, etc.)
│   ├── [Feature]Page.tsx  # Page component (presenter)
│   ├── components/  # Feature-specific components
│   ├── services/    # Business logic and API calls
│   └── state/       # Feature-specific state management
```

### Key Technologies

- **Frontend**: React 19, TypeScript, Vite, styled-components
- **Word Cloud**: D3.js, d3-cloud for layout generation
- **Backend**: Separate Node.js/Express app with Socket.IO (`../ordsky.no-api`), runs in Docker on a VPS behind nginx
- **Testing**: Jest with jsdom, React Testing Library
- **Routing**: React Router 7

### State Management

- Context providers for global state (CallToActionContext, SessionProvider)
- useReducer hooks for complex state logic
- Local storage for user statistics and preferences

### Core Word Cloud Logic

- `createCloud()` in `src/common/core/createCloud.ts` - Main cloud generation function
- `countWords()` in `src/common/core/countWords.ts` - Text analysis
- `downloadAsPng()` in `src/common/core/downloadAsPng.ts` - Export functionality
- Type definitions in `src/common/core/cloud.types.ts`

### Code Style Requirements

- No default exports (enforced by ESLint rule `import/no-default-export`)
- Explicit function return types required (`@typescript-eslint/explicit-function-return-type`)
- Atomic design component organization
- MVP pattern: Page components act as presenters, Services handle business logic

### Deployment

- **Frontend**: Deployed as a static site (built via `npm run build`, served by nginx on VPS)
- **Backend**: Runs in Docker/docker-compose on the same VPS (`../ordsky.no-api`), managed from this repo's `docker-compose.yml`
- **Reverse proxy**: nginx routes `/api/*` and `/ws` to the backend container, serves static frontend files

### Development Notes

- Vite dev server proxies `/api` and `/ws` to `localhost:3000` (the backend Node.js app)
- Run the backend locally with `npm run dev` in `../ordsky.no-api` before starting the frontend
- Jest configured with jsdom environment for React component testing
- ESLint configured with TypeScript, React, and accessibility rules

