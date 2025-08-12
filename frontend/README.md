# Lifestyle Balance Board - Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), featuring professional API integration and comprehensive testing.

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://lifestyle-balance-board.onrender.com
```

For local development, use:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Installation

```bash
npm install
```

## Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

### Testing

This project uses [Vitest](https://vitest.dev/) for testing with comprehensive test coverage:

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Build

```bash
npm run build
npm start
```

## Architecture

### API Service Layer

The application uses a centralized API service located at `src/services/api.ts` for all backend communication:

```typescript
import { ApiService } from '@/services/api'

// Test connection to backend
const result = await ApiService.testConnection()

// Get API info
const apiInfo = await ApiService.getApiInfo()

// Health check
const health = await ApiService.getHealthCheck()
```

### Components

- `ApiTestComponent`: Reusable component for testing backend connectivity
- Located in `src/components/` with comprehensive test coverage

### Testing Strategy

This project follows **Test-Driven Development (TDD)** principles:

1. **Unit Tests**: All API service functions have comprehensive test coverage
2. **Component Tests**: React components are tested with React Testing Library
3. **Integration Tests**: Frontend-backend communication is thoroughly tested

#### Test Structure

```
src/
├── services/
│   ├── api.ts
│   └── __tests__/
│       └── api.test.ts
├── components/
│   ├── ApiTestComponent.tsx
│   └── __tests__/
│       └── ApiTestComponent.test.tsx
└── __tests__/
    └── setup.ts
```

#### TDD Workflow

1. Write failing tests first
2. Implement minimal code to pass tests
3. Refactor while keeping tests green
4. Ensure comprehensive coverage

### Environment Configuration

- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL
- Environment variables follow Next.js conventions with `NEXT_PUBLIC_` prefix for client-side access

## Contributing

When contributing to this project:

1. Follow TDD principles - write tests first
2. Ensure all tests pass before submitting
3. Use the established API service for backend communication
4. Follow TypeScript best practices
5. Update documentation as needed

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
