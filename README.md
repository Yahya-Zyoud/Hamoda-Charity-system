# Hamoda Charity Platform

A full-stack academic charity web application that connects donors with charitable projects and allows people in need to submit help requests — all managed through a real-time admin dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Hamoda AI Assistant](#hamoda-ai-assistant)
- [Database Strategy](#database-strategy)
- [Feature Status](#feature-status)
- [Team](#team)

---

## Overview

Hamoda Charity is a digital platform built to streamline charity operations:

- **Donors** can browse active projects and make contributions
- **People in need** can submit help requests with supporting documents
- **Admins** manage everything from a dedicated dashboard — reviewing requests, tracking donations, and monitoring platform statistics

The platform is developed as an academic project by a team of 5 students and is actively being migrated from JSON-file storage to a full MongoDB + Mongoose architecture.

---

## Features

| Feature | Description |
|---|---|
| Help Request Form | Submit requests with document uploads; AI auto-classifies type and urgency |
| Donation Flow | Multi-step donation with project selection, amount picker, and payment method |
| Project Browser | View, filter, and explore all active charity projects |
| Admin Dashboard | 8-page admin panel: Overview, Requests, Projects, Donations, Users, Notifications, Reports |
| Authentication | Clerk-powered auth with role-based access (admin / user); graceful fallback if key is missing |
| Email Subscription | Newsletter signup with rate limiting |
| Hamoda AI | OpenAI-powered assistant that classifies help requests and generates Arabic summaries |
| Responsive UI | RTL-friendly, mobile-first design with Tailwind CSS |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2 | UI framework |
| React Router | ^7.14 | Client-side routing |
| Vite | ^8.0 | Build tool & dev server |
| Tailwind CSS | ^4.2 | Utility-first styling |
| Framer Motion | ^12.38 | Animations |
| Clerk React | ^5.61 | Authentication |
| Lucide React | ^1.8 | Icons |
| Recharts | ^3.8 | Charts & analytics |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | ^5.2 | REST API server |
| Mongoose | ^8.0 | MongoDB ODM |
| MongoDB | ^7.2 | Database driver |
| Clerk Express | ^2.1 | JWT verification middleware |
| Multer | ^2.1 | File upload handling |
| OpenAI SDK | ^4.67 | Hamoda AI assistant |
| Stripe | ^22.1 | Payment processing |
| Helmet | ^8.1 | Security headers |
| express-rate-limit | ^8.5 | Rate limiting |

### Infrastructure

| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Local MongoDB container |
| MongoDB Atlas M0 | Production database (free tier) |
| Vercel | Frontend deployment |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│   React 19 + Vite  ·  Tailwind CSS  ·  React Router v7     │
│   Clerk (lazy)     ·  Framer Motion ·  Recharts            │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP / JSON  (VITE_API_URL)
┌────────────────────────▼────────────────────────────────────┐
│                  Express API  :5000                         │
│   /api/projects   /api/help-requests   /api/donations       │
│   /api/users      /api/notifications   /api/admin/stats     │
│                                                             │
│   Middleware: Clerk JWT · Helmet · CORS · Rate-limit        │
│   Services:   Business logic layer                          │
│   Models:     Mongoose schemas (10 models)                  │
└──────────┬──────────────────────────┬───────────────────────┘
           │                          │
    ┌──────▼───────┐         ┌────────▼────────┐
    │  MongoDB     │         │   OpenAI API    │
    │  (Docker /   │         │  gpt-4o-mini    │
    │   Atlas M0)  │         │  (Hamoda AI)    │
    └──────────────┘         └─────────────────┘
```

### Folder Structure

```
/
├── frontend/src/
│   ├── App.jsx                    # Routes
│   ├── main.jsx                   # Entry — lazy-loads ClerkProvider
│   ├── pages/
│   │   ├── home/                  # Landing page + 5 sections
│   │   ├── Donation_page/         # Multi-step donation flow
│   │   ├── HelpRequest.jsx        # Help request form
│   │   ├── Project.jsx            # Projects browser
│   │   ├── TeamWork.jsx           # Team page
│   │   ├── AboutUs.jsx
│   │   ├── UserProfilePage.jsx
│   │   └── admin/                 # 8 admin pages
│   ├── components/
│   │   ├── admin/                 # Sidebar, Topbar, Card, Modal, Table, ...
│   │   ├── cards/                 # ProjectCard, PartnerCard, ServiceCard
│   │   ├── project/               # Hero, Grid, Filters, Stats, CTA
│   │   ├── team/                  # TeamGrid, TeamCard, SearchBar
│   │   └── auth/ClerkBridge.jsx   # Clerk → AppAuthContext bridge
│   ├── contexts/AppAuthContext.jsx # { user, isAdmin, isLoaded, signOut }
│   ├── services/api.js            # Centralized fetch client
│   ├── hooks/                     # useClerkSignInButton, useCountUp
│   ├── lib/                       # clerkConfig.js, contactLinks.js
│   └── styles/admin.css
│
├── backend/
│   ├── server.js                  # Express entry point
│   ├── config/                    # environment.js, db.js, constants.js
│   ├── routes/                    # 12 route files (index.js mounts all)
│   ├── controllers/               # Request handling layer
│   ├── services/                  # Business logic layer
│   ├── models/                    # 10 Mongoose models
│   ├── middleware/                # auth, responseFormatter, errorHandler
│   ├── data/                      # JSON fallback files + seed scripts
│   └── utils/                     # fileHandler, logger
│
├── docker-compose.yml             # Full stack (prod)
├── docker-compose.dev.yml         # Local MongoDB only
├── vercel.json                    # Vercel deployment config
└── package.json                   # Root: concurrently script
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Docker Desktop** (for local MongoDB) — [Download](https://www.docker.com/products/docker-desktop/)
- **Git**

Optional:
- A [Clerk](https://clerk.com) account for authentication
- An [OpenAI](https://platform.openai.com) API key for the Hamoda AI assistant

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/hamoda-charity-system.git
cd hamoda-charity-system

# 2. Install all dependencies (root + frontend + backend)
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. Copy environment files and fill in values
cp .env.example .env
cp backend/.env.example backend/.env
# Edit frontend/.env and backend/.env with your values

# 4. Start MongoDB (Docker)
docker compose -f docker-compose.dev.yml up -d

# 5. (Optional) Seed the database
cd backend && npm run seed && cd ..

# 6. Run the full stack
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health check:** http://localhost:5000/health

---

## Environment Variables

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...     # Optional — app works without it
```

### `backend/.env`

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Authentication (optional)
CLERK_SECRET_KEY=sk_test_...

# Local development (Docker MongoDB)
MONGODB_URI=mongodb://root:rootsecret@localhost:27017/hamoda_charity?authSource=admin

# Production — swap this before deploying to Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/hamoda_charity?retryWrites=true&w=majority

# Hamoda AI (optional — falls back to keyword heuristic if missing)
OPENAI_API_KEY=sk-...
HAMODA_MODEL=gpt-4o-mini    # default
```

> **Never commit `.env` files** — they contain secrets.

---

## Docker Setup

### Local Development (MongoDB only)

```bash
# Start a local MongoDB container
docker compose -f docker-compose.dev.yml up -d

# Stop it
docker compose -f docker-compose.dev.yml down
```

This runs MongoDB on `localhost:27017` with credentials `root / rootsecret`. Frontend and backend still run locally via `npm run dev`.

### Full Stack (Production-like)

```bash
# Build and start all services (MongoDB + backend + frontend)
docker compose up --build

# Stop everything
docker compose down

# Remove volumes (wipes database data)
docker compose down -v
```

Services:
- `hamoda_db` — MongoDB 7 on port 27017
- `hamoda_backend` — Express API on port 5000
- `hamoda_frontend` — Vite/Nginx on port 5173 → 80

---

## Available Scripts

### Root

```bash
npm run dev              # Run frontend + backend concurrently
npm run start:frontend   # Frontend only (Vite on :5173)
npm run start:backend    # Backend only (Express on :5000)
```

### Frontend (`cd frontend`)

```bash
npm run dev      # Dev server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # ESLint check
```

### Backend (`cd backend`)

```bash
npm start        # Start server (production)
npm run dev      # Start with --watch (auto-reload)
npm run seed     # Seed MongoDB with sample data
npm test         # Run Jest test suite
```

---

## API Reference

All endpoints are prefixed with `/api`. Authenticated endpoints require a Clerk JWT in the `Authorization: Bearer <token>` header.

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/projects` | — | List all projects |
| GET | `/projects/:id` | — | Get single project |
| POST | `/projects` | Admin | Create project |
| PUT | `/projects/:id` | Admin | Update project |
| DELETE | `/projects/:id` | Admin | Delete project |

### Help Requests

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/help-requests` | — | Submit a help request (triggers Hamoda AI) |
| GET | `/help-requests` | Admin | List all requests |
| GET | `/help-requests/:id` | Admin | Get single request |
| PUT | `/help-requests/:id/status` | Admin | Approve / reject |
| POST | `/help-requests/:id/reanalyze` | Admin | Re-run Hamoda AI |

### Donations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/donations` | User | Submit a donation |
| GET | `/donations` | Admin | List all donations |
| GET | `/donations/my` | User | Current user's donation history |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | User | Get own profile |
| PUT | `/users/me` | User | Update own profile |
| GET | `/users` | Admin | List all users |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Platform-wide statistics |

### Other

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/services` | — | List services |
| GET | `/stats` | — | Home page statistics |
| GET | `/partners` | — | List partners |
| GET | `/team` | — | List team members |
| POST | `/subscribe` | — | Email newsletter signup (rate-limited) |
| GET | `/health` | — | Server health check |

### Response Format

All responses use a consistent envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "optional message"
}
```

The frontend `api.js` client automatically unwraps `response.data`.

---

## Hamoda AI Assistant

**حمودة** is a built-in AI assistant that automatically analyzes help requests using OpenAI.

### What It Does

When a help request is submitted, Hamoda AI runs in the background and:

1. **Classifies** the request into the correct `helpType`:
   - `medical` · `education` · `food` · `housing` · `financial` · `other`
2. **Estimates urgency**: `low` · `medium` · `high` · `critical`
3. **Generates a short Arabic summary** for the admin dashboard
4. **Records its confidence score** and the model used

### Fields Written to the Database

```
aiSuggestedHelpType   — classified category
aiUrgency             — urgency level
aiConfidence          — confidence score (0–1)
aiSummary             — Arabic summary for admins
aiClassifiedAt        — timestamp
aiModel               — model used (e.g. gpt-4o-mini)
```

### Setup

1. Add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-...
   HAMODA_MODEL=gpt-4o-mini   # optional, this is the default
   ```
2. Restart the server — new requests are analyzed automatically.

### Fallback Behavior

If `OPENAI_API_KEY` is missing or the API call fails, Hamoda falls back to a **keyword heuristic** classifier. Failures are logged and swallowed — request creation always succeeds.

---

## Database Strategy

### Local Development — Docker

Each developer runs their own MongoDB container. No shared state, no internet needed.

```bash
# Start
docker compose -f docker-compose.dev.yml up -d

# Connection string
mongodb://root:rootsecret@localhost:27017/hamoda_charity?authSource=admin
```

### Production — MongoDB Atlas M0

- Swap `MONGODB_URI` in `backend/.env` to the Atlas connection string
- Database name: `hamoda_charity`
- Atlas clusters on the free tier auto-pause after ~10 minutes of inactivity (first request wakes it in 10–15 sec)
- Mongoose 8+ handles TLS automatically

### Mongoose Models

| Model | Collection | Status |
|---|---|---|
| Project | `projects` | ✅ Ready |
| HelpRequest | `help_requests` | ✅ Ready |
| Donation | `donations` | ✅ Ready |
| User | `users` | ✅ Ready |
| Notification | `notifications` | ✅ Ready |
| Partner | `partners` | ✅ Ready |
| Service | `services` | ✅ Ready |
| Subscription | `subscriptions` | ✅ Ready |
| Team | `team` | ✅ Ready |
| Stat | `stats` | ✅ Ready |

---

## Feature Status

| Feature | Status | Notes |
|---|---|---|
| Home page (all sections) | ✅ Done | Hero, Projects, Services, Stats, Partners |
| Admin dashboard UI | ✅ Done | 8 pages fully built |
| Clerk authentication | ✅ Done | Lazy-loaded, graceful fallback |
| Admin route guard | ✅ Done | `AdminRoute` component |
| Projects page | ✅ Done | With filters and stats |
| Team page | ✅ Done | With search |
| About page | ✅ Done | |
| Email subscription | ✅ Done | Rate-limited, saves to DB |
| Hamoda AI (OpenAI) | ✅ Done | Keyword fallback included |
| MongoDB models | ✅ Done | All 10 models defined |
| Help request form | ⏳ Pending | UI done, backend integration in progress |
| Real payments (Stripe) | ⏳ Pending | Stripe package installed, integration pending |
| User profile page | ⏳ Pending | Page exists, data wiring pending |
| Admin pages ↔ real DB | ⏳ Pending | Currently using mock/static data |
| Donation history | ⏳ Pending | Schema ready, UI pending |

---

## Team

| Name | Role |
|---|---|
| Murad Hisham Aydi | Full-stack developer |
| Hamza Nael Hubeisha | Full-stack developer |
| Ahmed Hassan Asaad | Full-stack developer |
| Yahya Saed Zyoud | Full-stack developer |
| Mohammad Nael Daraghmeh | Full-stack developer |

---

> This project is developed for academic purposes.
