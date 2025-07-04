# Overview

This is a full-stack web application built with React frontend and Express backend, featuring a Facebook-like login interface with modern UI components. The application uses TypeScript throughout and implements a clean architecture with shared schemas between frontend and backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom Facebook-themed color scheme
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM with migrations
- **Validation**: Zod schemas shared with frontend
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot reload with tsx

## Key Components

### Shared Schema (`/shared/schema.ts`)
- Centralized type definitions using Zod
- User schema with id, email, username, createdAt fields
- Login request/response schemas
- Type-safe communication between frontend and backend

### Frontend Components
- **HomePage**: Main login interface with BloodSource branding
- **SignupPage**: User registration page with smooth animations
- **FloatingAIButton**: Interactive AI assistant button (placeholder)
- **UI Components**: Complete set of reusable components from shadcn/ui
- **Toast System**: User feedback notifications
- **Form Validation**: Real-time validation with error handling

### Backend Services
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Route Handlers**: RESTful API endpoints for authentication
- **Middleware**: Request logging and error handling
- **Development Server**: Vite integration for full-stack development

## Data Flow

1. **User Authentication Flow**:
   - User submits login form on frontend
   - Form data validated with Zod schemas
   - API request sent to `/api/login` endpoint
   - Backend validates credentials against storage
   - Response returned with user data or error

2. **User Registration Flow**:
   - User navigates to signup page with smooth animations
   - Registration form validated with Zod schemas
   - API request sent to `/api/signup` endpoint
   - Backend checks for existing users and creates new account
   - Success redirects to login page with confirmation

2. **Development Workflow**:
   - Frontend served by Vite dev server
   - Backend runs with hot reload via tsx
   - Shared schemas ensure type consistency
   - API requests proxied through Vite

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database
- **Connection**: Environment variable `DATABASE_URL` required
- **Session Storage**: PostgreSQL-backed session store

### UI Framework
- **Radix UI**: Accessible component primitives
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Icons**: Additional social media icons

### Development Tools
- **Replit Integration**: Cartographer plugin and runtime error overlay
- **ESBuild**: Production build bundling
- **Drizzle Kit**: Database migration management

## Deployment Strategy

### Development
- Single command start: `npm run dev`
- Hot reload for both frontend and backend
- Integrated development server with Vite

### Production
- Build process: `npm run build`
  - Frontend: Vite build to `dist/public`
  - Backend: ESBuild bundle to `dist/index.js`
- Start command: `npm start`
- Static file serving from build directory

### Database Management
- Migration files stored in `/migrations`
- Schema defined in `/shared/schema.ts`
- Push changes: `npm run db:push`

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Added signup page with animations and backend integration
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```