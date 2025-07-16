# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
- `npm start` - Start development server with Vite
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run serve` - Preview production build locally
- `npm run functions` - Start Wrangler dev server for Cloudflare Pages functions

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
  - Collaborative sessions (`/felles`)
- **Cloudflare Pages Integration**: Functions deployed to Cloudflare Pages with D1 database

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
functions/           # Cloudflare Pages functions
```

### Key Technologies
- **Frontend**: React 19, TypeScript, Vite, styled-components
- **Word Cloud**: D3.js, d3-cloud for layout generation
- **Backend**: Cloudflare Pages Functions, D1 database
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

### Development Notes
- Uses Vite dev server with proxy to Wrangler dev server (port 8788) for API calls
- Jest configured with jsdom environment for React component testing
- ESLint configured with TypeScript, React, and accessibility rules
- D1 database binding configured in wrangler.toml for collaborative features