# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands
- `docker-compose up -d` - Start PostgreSQL database and pgAdmin
- `npx prisma migrate dev` - Apply database migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open database GUI

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Material-UI (MUI) with custom theme
- **Deployment**: Docker for local development

### Database Schema
- **User model**: id (UUID), email (unique), name (optional), timestamps
- **Course model**: id (UUID), title, description (optional), timestamps  
- **Many-to-many relationship**: Users can be enrolled in multiple courses

### Key Architecture Patterns

**Prisma Configuration**
- Custom client output path: `src/generated/prisma`
- Global singleton pattern for database connection in `src/lib/prisma.ts`
- Connection pooling handled automatically

**API Routes** (`src/app/api/users/route.ts`)
- RESTful endpoints for user CRUD operations
- Error handling with proper HTTP status codes
- Direct Prisma integration for database operations

**Component Architecture**
- Client-side state management with React hooks
- Custom hook `useUserTable` for table logic (search, pagination)
- Material-UI components with custom theme in `src/theme.ts`
- Global theme provider via `ClientThemeProvider`

**Data Flow**
- Frontend components fetch data from API routes
- API routes interact directly with Prisma client
- Real-time updates via local state refresh pattern
- Optimistic UI updates with error handling

### Development Environment
- Docker Compose provides PostgreSQL (port 5432) and pgAdmin (port 5050)
- TypeScript with strict configuration
- Path aliases: `@/*` maps to `src/*`
- Hot reload enabled for development

### Database Connection
Set `DATABASE_URL` environment variable to connect to PostgreSQL. Local development uses Docker Compose configuration with default credentials.