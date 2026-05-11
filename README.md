<!--
  Job Portal (Next.js)
  Keep this README short, accurate, and setup-focused.
-->

# Job Portal

A full-stack Job Portal built with Next.js (App Router), MySQL, and NextAuth (Credentials). It supports **job-seekers**, **companies**, and **admins**, plus AI-powered tools for resumes and interview preparation.

## Features

### Authentication & Roles

- Email/password signup and login (NextAuth Credentials + bcrypt)
- Role-based access control: `job-seeker`, `company`, `admin`
- JWT sessions

### Job Seeker

- Browse job listings with filters (search, employment type, work type, level, location)
- Job details page with company snapshot and tags
- Apply to jobs (resume link + cover letter)
- Application history tracking
- Save/unsave jobs
- User dashboard pages: overview, profile, applications, saved jobs, settings

### Company

- Company dashboard (overview)
- Post a job with tags
- Manage posted jobs (list, update status, delete)
- View applicants for company jobs (optionally filter by job)
- Update application status: `pending`, `reviewed`, `shortlisted`, `interview`, `rejected`, `accepted`
- Company profile and settings pages

### Admin

- Admin dashboard with platform stats (users, companies, jobs, applications, active jobs)
- Admin management areas for users, companies, jobs, applications, reports, and settings (UI + APIs)

### AI Tools (Gemini)

- AI Resume generator (`/ai-resume`) that returns structured JSON output
- Interview prep MCQ generator (10 MCQs per request) with duplication-avoidance + fallback set
- Interview performance report generator with fallback report when AI is unavailable

## Tech Stack

- Next.js `16.0.5` (App Router)
- React `19`
- NextAuth `v4` (Credentials Provider)
- MySQL (`mysql2`)
- Tailwind CSS `v4`
- React Hook Form
- TipTap editor (used in the UI where rich text is needed)

## Getting Started

### 1) Prerequisites

- Node.js (recommended: current LTS)
- MySQL server running locally or accessible remotely

### 2) Install dependencies

```bash
npm install
```

### 3) Set up the database

Create the database/tables using:

- `database/schema.sql`

Example:

```sql
SOURCE database/schema.sql;
```

### 4) Configure environment variables

Create a `.env` file in the project root (same folder as `package.json`).

Required:

```env
# NextAuth
NEXTAUTH_SECRET=your-long-random-secret
NEXTAUTH_URL=http://localhost:3000

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=job_portal

# Gemini (optional; enables AI features)
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
```

Security note: don't commit secrets (API keys / passwords) to git.

### 5) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run clean` - remove `.next`
- `npm run check` - lint + build

## Project Structure (high level)

- `app/` - pages (App Router) + route handlers under `app/api/`
- `components/` - reusable UI components
- `config/` - DB connection
- `database/` - MySQL schema files
- `public/` - static assets

## API Overview

Some key routes (see `app/api/` for full list):

- Auth: `POST /api/auth/signup`, `POST /api/auth/*` (NextAuth)
- Jobs: `GET /api/jobs`, `GET /api/jobs/:id`
- Applications: `POST /api/applications`, `GET /api/applications`
- Saved jobs: `POST /api/saved-jobs`, `GET /api/saved-jobs`, `DELETE /api/saved-jobs?job_id=...`
- Company: `GET/POST/PUT/DELETE /api/company/job`, `GET/PUT /api/company/applications`
- Admin: `GET /api/admin/stats` (+ additional admin management endpoints)
- AI: `POST /api/ai-resume`, `POST /api/generate-mcqs`, `POST /api/generate-interview-report`
