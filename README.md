# CRO Analyzer Frontend

A Next.js application for website conversion optimization analysis.

## Features

- **Authentication System**: JWT-based authentication with login/register functionality
- **Protected Routes**: Reports page requires authentication
- **One-Time Analysis**: Quick website analysis without authentication
- **Reports Dashboard**: View and manage analysis reports (protected)
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Make sure the backend server is running on port 3001

4. Start the development server:
```bash
npm run dev
```

## Authentication Flow

- **Unauthenticated users**: Can access the main page (`/`) and use one-time analysis
- **Authenticated users**: Can access all features including the protected reports page (`/reports`)
- **Reports page**: Automatically redirects unauthenticated users to the main page

## Routes

- `/` - Main page with authentication and one-time analysis
- `/reports` - Protected reports dashboard (requires authentication)

## Components

- `AuthPage` - Login/Register forms
- `ProtectedRoute` - Authentication middleware component
- `AuthProvider` - Context provider for authentication state
- `useAuth` - Hook for authentication functionality

## Backend Integration

The frontend integrates with the Fastify backend API:
- Authentication endpoints: `/api/auth/login`, `/api/auth/register`
- CRO analysis endpoints: `/api/cro/*`
- JWT token-based authentication
