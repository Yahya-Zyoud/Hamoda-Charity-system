# Project Overview
# Charity Platform (Hamoda-Charity)
This project is an academic web application developed to create a digital charity platform.

# Features
- Submit help requests with documents
- Donate to charity projects
- View active projects
- User profile and donation history
- Admin dashboard for managing requests and projects

# Tech Stack
- Frontend: React.js, HTML, CSS, JavaScript
- Backend: Node.js
- Database: MySQL
- APIs: Stripe / PayPal, OpenAI
 
# Team
- Murad Hisham Aydi
- Hamza Nael Hubeisha
- Ahmed Hassan Asaad
- Yahya Saed Zyoud
- Mohammad Nael Daraghmeh

# حمودة (Hamoda) — AI assistant
The platform ships with an AI helper named **حمودة** that uses OpenAI to:
- Auto-classify each new help request into the correct `helpType`
  (medical / education / food / housing / financial / other)
- Estimate the urgency (low / medium / high / critical)
- Generate a short Arabic summary for the admin dashboard

The AI fields are written back onto the `HelpRequest` document as
`aiSuggestedHelpType`, `aiUrgency`, `aiConfidence`, `aiSummary`,
`aiClassifiedAt`, and `aiModel`.

## Setup
1. `cd backend && npm install` (installs the `openai` package).
2. Add the following to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-...
   # Optional — defaults to gpt-4o-mini
   HAMODA_MODEL=gpt-4o-mini
   ```
3. Restart the server. New requests will be analyzed automatically.

## Endpoints
- `POST /api/help-requests` — creating a request kicks off حمودة
  in the background; the user gets an instant response.
- `POST /api/help-requests/:id/reanalyze` — re-run حمودة on an existing
  request (used by the admin dashboard).

## Fallback behavior
If `OPENAI_API_KEY` is not set (or the `openai` package isn't installed
yet), حمودة falls back to a simple keyword heuristic so the app keeps
working. Failures never break request creation — they're logged and
swallowed.
