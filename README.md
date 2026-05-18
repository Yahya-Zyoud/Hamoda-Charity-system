# Hamoda Charity Platform

Academic web application for a digital charity platform — An-Najah National University graduation project, team of 5 students.

## Features
- Browse active projects with progress bars and beneficiary stats
- Submit a help request with optional document upload
- Make a donation (general, or scoped to a specific project)
- User profile showing personal help-requests and donation history
- Admin dashboard for managing requests, projects, donations, users, and notifications

## Tech Stack
| Layer        | Technology                                                  |
|--------------|-------------------------------------------------------------|
| Frontend     | React 19 + Vite, Tailwind CSS, React Router v7              |
| Backend      | Node.js + Express 5, Mongoose, Helmet, express-rate-limit   |
| Database     | MongoDB (Docker locally)                                    |
| Auth         | Clerk (optional — degrades gracefully without keys)         |
| File uploads | Multer (local disk under `backend/public/uploads/`)         |

Donations are recorded with `status: "pending"` and confirmed manually by an admin. No payment gateway is integrated — this is intentional for the academic scope.

## Setup

```bash
# 1. Install dependencies
npm install
npm install --prefix backend
npm install --prefix frontend

# 2. Configure env (NEVER commit real .env)
cp backend/.env.example backend/.env       # then edit values
cp frontend/.env.example frontend/.env.local

# 3. Start a local MongoDB
docker compose -f docker-compose.dev.yml up -d

# 4. Run dev servers (concurrent)
npm run dev
```

Backend listens on `http://localhost:5000`, frontend on `http://localhost:5173`.

## Auth modes

| Scenario                | Clerk keys set | `ALLOW_DEV_AUTH_BYPASS` | Result                                                       |
|-------------------------|----------------|-------------------------|--------------------------------------------------------------|
| Local dev with Clerk    | Yes            | (ignored)               | Full Clerk JWT verification                                  |
| Local dev without Clerk | No             | `1`                     | `x-user-id` header for auth; admin needs `x-admin-bypass: 1` |
| Misconfigured           | No             | unset                   | All protected routes return 401                              |

## Tests

```bash
npm test --prefix backend
```

Tests covering live MongoDB queries are skipped unless you provide a real `MONGO_URI`.

## Seed sample data

```bash
npm run seed --prefix backend
```

Loads projects, services, stats, partners, and stories from `backend/data/*.json`.

## Team
- Murad Hisham Aydi
- Hamza Nael Hubeisha
- Ahmed Hassan Asaad
- Yahya Saed Zyoud
- Mohammad Nael Daraghmeh
