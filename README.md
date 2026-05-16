# Charity Platform (Hamoda-Charity)

Academic web application for a digital charity platform.

## Features
- Submit help requests with optional document upload
- Browse active projects with progress and beneficiary stats
- Donate to a specific project (amount is credited to the project's raised counter) or make a general donation
- User profile with help-request and donation history
- Admin dashboard for managing requests, projects, donations, users, notifications, and reports

## Tech Stack
- **Frontend:** React 19 + Vite, Tailwind CSS, React Router v7, Framer Motion
- **Backend:** Node.js + Express 5, Mongoose, Helmet, express-rate-limit
- **Database:** MongoDB (Docker locally, Atlas in production)
- **Auth:** Clerk (optional — app degrades gracefully when keys are absent)
- **Payments:** Currently records donations as `pending` for manual processing. Stripe/PayPal integration is not implemented.

## Setup

```bash
# 1. Install dependencies
npm install
npm install --prefix backend
npm install --prefix frontend

# 2. Configure env (NEVER commit real .env)
cp backend/.env.example backend/.env       # then edit values
cp frontend/.env.example frontend/.env.local

# 3. (Optional) Start a local MongoDB
docker compose up -d

# 4. Run dev servers (concurrent)
npm run dev
```

Backend listens on `http://localhost:5000`, frontend on `http://localhost:5173`.

## Auth modes

| Scenario | `CLERK_SECRET_KEY` + `CLERK_PUBLISHABLE_KEY` | `ALLOW_DEV_AUTH_BYPASS` | Result |
|---|---|---|---|
| Production | Set | (ignored) | Full Clerk JWT verification |
| Local dev with Clerk | Set | (ignored) | Full Clerk JWT verification |
| Local dev without Clerk | Unset | `1` (non-prod only) | `x-user-id` header for auth; admin requires `x-admin-bypass: 1` |
| Misconfigured | Unset | Unset / production | All protected routes return 401 |

The dev bypass refuses to run in production even when both flags are set.

## Tests

```bash
npm test --prefix backend
```

Tests covering live MongoDB queries are skipped unless you provide a real `MONGODB_URI`.

## Team
- Murad Hisham Aydi
- Hamza Nael Hubeisha
- Ahmed Hassan Asaad
- Yahya Saed Zyoud
- Mohammad Nael Daraghmeh
