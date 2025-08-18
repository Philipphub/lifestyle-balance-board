# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lifestyle Balance Board is a full-stack application for tracking personal lifestyle metrics related to training, recovery, and mindfulness. It uses a monorepo structure with npm workspaces.

## Architecture

### Stack

-   **Frontend**: Next.js 15.4.6 with TypeScript, React 19, TailwindCSS 3.4
-   **Backend**: Express.js with TypeScript, running on port 3001
-   **Testing**: Vitest for frontend, Jest for backend
-   **Deployment**: Configured for Vercel (frontend)

### Project Structure

-   `/frontend` - Next.js application with App Router
-   `/backend` - Express API server
-   Root package.json manages both via npm workspaces

## Essential Commands

### Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Run frontend only (port 3000)
npm run dev:frontend

# Run backend only (port 3001)
npm run dev:backend
```

### Building

```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

### Testing

```bash
# Run all tests (frontend and backend)
npm test

# Frontend testing (from frontend directory)
cd frontend
npm run test        # Watch mode with Vitest
npm run test:run    # Single run
npm run test:coverage

# Backend testing (from backend directory)
cd backend
npm test           # Run Jest tests
npm run test:watch # Watch mode
```

### Linting

```bash
# Frontend only (from frontend directory)
cd frontend && npm run lint
```

## Key Implementation Details

### Frontend

-   Uses Next.js App Router (src/app structure)
-   API communication via ApiService at `/src/services/api.ts`
-   Component testing setup with Vitest and Testing Library
-   Global styles use Tailwind directives in `app/globals.css`

### Backend

-   Express server with middleware: helmet, cors, morgan
-   Health check endpoint at `/api/health`
-   TypeScript compilation outputs to `/dist`
-   Environment variables via dotenv

### API Integration

-   Frontend expects backend at http://localhost:3001 (development)
-   CORS enabled on backend for cross-origin requests
-   ApiTestComponent available for testing connectivity

## Development Workflow

1. Always run `npm run dev` from root to start both services
2. Frontend changes hot-reload automatically
3. Backend uses tsx watch for auto-restart on changes
4. Run tests before committing major changes
5. Build both services to verify production readiness
