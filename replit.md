# IT Projects Dashboard

## Overview
A comprehensive dashboard for visualizing IT projects across the KLG Group organization. The dashboard displays project data from an Excel file with interactive charts and a filterable data table.

## Current State
- **Status**: Complete MVP with Authentication
- **Last Updated**: January 2026

## Features
- Multi-brand login page with Kaplan, Alpadia, ESL, and Azurlingua logos
- Authentication via master password or magic link email
- Summary cards showing total projects, current year projects, business units, and categories
- **Interactive Charts with Filters:**
  - Bar chart showing projects by year (with Size filter)
  - Pie/donut chart showing projects by business unit (with Year filter)
  - Horizontal bar chart showing top project categories (with Year filter)
  - Bar chart showing project size distribution (with Year filter)
- Searchable and filterable data table with all projects
- Dark/light theme toggle
- Logout functionality
- Responsive design for mobile and desktop

## Authentication

### Login Methods
1. **Master Password**: `Bright-Winter-Portfolio-2026!`
2. **Magic Link**: Enter email to receive a login link (requires email service configuration)

### Session Management
- Express-session based authentication
- Sessions stored server-side with secure cookies
- Auto-redirect authenticated users from login to dashboard

## Project Architecture

### Frontend (client/)
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: wouter
- **State Management**: TanStack Query for server state
- **Charts**: Recharts library
- **Theme**: Professional blue/slate color scheme with dark mode support
- **Auth**: Context-based auth state with protected routes

### Backend (server/)
- **Framework**: Express.js with TypeScript
- **Data Source**: Excel file (xlsx) parsed at runtime
- **Storage**: In-memory storage with caching
- **Session**: express-session for authentication

### Key Files
- `client/src/pages/login.tsx` - Multi-brand login page
- `client/src/pages/dashboard.tsx` - Main dashboard page
- `client/src/lib/auth.tsx` - Auth context and protected route component
- `client/src/components/summary-cards.tsx` - KPI summary cards
- `client/src/components/charts/` - Chart components
- `client/src/components/projects-table.tsx` - Filterable data table
- `server/routes.ts` - API endpoints including auth
- `server/storage.ts` - Data parsing and storage logic
- `shared/schema.ts` - TypeScript types and Zod schemas

### API Endpoints
- `GET /api/projects` - Returns all projects with summary statistics
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/login` - Password login
- `POST /api/auth/magic-link` - Request magic link email
- `GET /api/auth/verify` - Verify magic link token
- `POST /api/auth/logout` - End session

### Data Model
```typescript
interface Project {
  id: number;
  year: number;
  project: string;
  businessUnit: string;
  category: string;
  size: string;  // XXL, XL, L, M, S
}
```

## Running the Project
The application runs on port 5000. Start with:
```bash
npm run dev
```

## Data Source
Projects are loaded from `attached_assets/KLG_Portfolio_Overview-Summary_2020-Present_1769180079644.xlsx` containing 72 IT projects from 2020-2025.

## Brand Assets
Logos are stored in `attached_assets/`:
- kaplan.svg - Kaplan International Languages
- alpadia.svg - Alpadia Language Schools
- esl.svg - ESL Education
- azurlingua.png - Azurlingua French School
