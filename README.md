# Lifestyle Balance Board

A full-stack dashboard application for tracking personal lifestyle metrics related to training, recovery, and mindfulness.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run both frontend and backend in development mode
npm run dev
```

Frontend will be available at http://localhost:3000  
Backend API will be running at http://localhost:3001

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **UI**: React 19 + TailwindCSS 3.4
- **Testing**: Vitest + React Testing Library

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Security**: Helmet, CORS
- **Testing**: Vitest + Supertest
- **Database**: PostgreSQL

## 🏗️ Project Structure

```
lifestyle-balance-board/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # App router pages
│   │   ├── components/
│   │   └── services/ # API integration
│   └── package.json
├── backend/           # Express API server
│   ├── src/
│   │   └── server.ts # Main server file
│   ├── dist/         # Compiled TypeScript
│   └── package.json
└── package.json      # Root workspace config
```

## 🛠️ Development

### Available Scripts

From the root directory:

```bash
# Development
npm run dev           # Run both frontend and backend
npm run dev:frontend  # Run frontend only
npm run dev:backend   # Run backend only

# Building
npm run build         # Build both frontend and backend
npm run build:frontend
npm run build:backend

# Testing
npm test              # Run all tests

# Frontend specific (from /frontend)
cd frontend
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report
npm run lint          # ESLint

# Backend specific (from /backend)
cd backend
npm run test          # Watch mode with Vitest
npm run test:run      # Single run
npm run test:coverage # Coverage report
```

## 🔌 API Integration

The frontend communicates with the backend API through the ApiService located at `/frontend/src/services/api.ts`. 

### Endpoints

- `GET /api/health` - Health check endpoint

## 🧪 Testing

### Frontend Testing
- Framework: Vitest
- Testing utilities: React Testing Library
- Run tests: `cd frontend && npm test`

### Backend Testing
- Framework: Vitest with Supertest
- API endpoint testing
- Run tests: `cd backend && npm run test`

## 🚢 Deployment

- **Frontend**: Deployed on Vercel with automatic deployments from main branch
- **Backend**: Deployed on Render with automatic deployments
- **Database**: PostgreSQL hosted on Render

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and backend directories as needed:

#### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://user:password@host:port/database
# Add other backend environment variables
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001  # Development
# For production, set to your Render backend URL
# NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request