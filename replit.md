# IT Projects Dashboard

## Overview
A comprehensive dashboard for visualizing IT projects across the KLG Group organization. The dashboard displays project data from an Excel file with interactive charts and a filterable data table.

## Current State
- **Status**: Complete MVP
- **Last Updated**: January 2026

## Features
- Summary cards showing total projects, current year projects, business units, and categories
- Bar chart showing projects by year
- Pie/donut chart showing projects by business unit
- Horizontal bar chart showing top project categories
- Bar chart showing project size distribution (XL, L, M, S)
- Searchable and filterable data table with all projects
- Dark/light theme toggle
- Responsive design for mobile and desktop

## Project Architecture

### Frontend (client/)
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: wouter
- **State Management**: TanStack Query for server state
- **Charts**: Recharts library
- **Theme**: Professional blue/slate color scheme with dark mode support

### Backend (server/)
- **Framework**: Express.js with TypeScript
- **Data Source**: Excel file (xlsx) parsed at runtime
- **Storage**: In-memory storage with caching

### Key Files
- `client/src/pages/dashboard.tsx` - Main dashboard page
- `client/src/components/summary-cards.tsx` - KPI summary cards
- `client/src/components/charts/` - Chart components
- `client/src/components/projects-table.tsx` - Filterable data table
- `server/routes.ts` - API endpoint for projects
- `server/storage.ts` - Data parsing and storage logic
- `shared/schema.ts` - TypeScript types and Zod schemas

### API Endpoints
- `GET /api/projects` - Returns all projects with summary statistics

### Data Model
```typescript
interface Project {
  id: number;
  year: number;
  project: string;
  businessUnit: string;
  category: string;
  size: string;  // XL, L, M, S
}
```

## Running the Project
The application runs on port 5000. Start with:
```bash
npm run dev
```

## Data Source
Projects are loaded from `attached_assets/KLG_Projects_1769167456131.xlsx` containing IT projects from 2020-2025.
