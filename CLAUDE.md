# Hamoda Charity System — Project Context

## What This Is
Academic charity web platform. Users donate to projects and submit help requests. Admins manage everything via a dashboard.
Team of 5: Murad, Hamza, Ahmed, Yahya (you), Mohammad.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, React Router v6, Lucide React, Framer Motion |
| Auth | Clerk (lazy-loade--d; app works without it if `VITE_CLERK_PUBLISHABLE_KEY` is missing) |
| Backend | Node.js + Express, JSON-file data (→ migrating to MongoDB) |
| Database | **Docker (local dev)** → **MongoDB Atlas M0 (production)** |
| ORM | Mongoose (to be added in DB migration phase) |
| Payments | Stripe / PayPal — NOT YET IMPLEMENTED |

---

## Run Commands
```bash
# Root — runs both frontend + backend together
npm run dev

# Separately
npm run start:frontend   # Vite on :5173
npm run start:backend    # Express on :5000

# Docker (local MongoDB)
docker compose up -d     # start Mongo container
docker compose down      # stop it
```

---

## Folder Structure
```
/
├── frontend/src/
│   ├── App.jsx                        # Routes
│   ├── main.jsx                       # Boot: lazy-loads ClerkProvider
│   ├── pages/
│   │   ├── home/
│   │   │   ├── HomePage.jsx
│   │   │   └── sections/             # HeroSection, ProjectsSection, ServicesSection,
│   │   │                             #   StatsSection, StoriesSection, PartnersSection
│   │   ├── Project.jsx               # Mohammad's page
│   │   ├── TeamWork.jsx              # Mohammad's page
│   │   └── admin/
│   │       ├── AdminDashboard.jsx    # Shell with nested Routes
│   │       ├── OverviewPage.jsx
│   │       ├── RequestsPage.jsx
│   │       ├── ProjectsPage.jsx
│   │       ├── DonationsPage.jsx
│   │       ├── UsersPage.jsx
│   │       ├── NotificationsPage.jsx
│   │       └── ReportsPage.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── AdminRoute.jsx            # Guards /admin/dashboard/* (requires isAdmin)
│   │   ├── ScrollToHash.jsx
│   │   ├── auth/ClerkBridge.jsx      # Feeds AppAuthContext from Clerk
│   │   └── admin/                    # Shared UI: DashboardLayout, Sidebar, Topbar,
│   │                                 #   Card, Btn, Badge, Input, Modal, Select,
│   │                                 #   StatCard, FilterTabs, TableParts
│   ├── contexts/AppAuthContext.jsx   # { user, isAdmin, isLoaded, signOut }
│   ├── services/api.js               # All fetch calls — BASE_URL = VITE_API_URL || "/api"
│   ├── lib/
│   │   ├── clerkConfig.js            # isClerkConfigured flag
│   │   └── contactLinks.js          # openDonationInquiry() → WhatsApp (temp placeholder)
│   ├── hooks/useClerkSignInButton.js
│   ├── constants/                    # Static data (heroSection icons, etc.)
│   └── styles/admin.css
│
├── backend/
│   ├── server.js                     # Express app entry
│   ├── config/
│   │   ├── environment.js            # PORT=5000, API_PREFIX=/api, CORS_ORIGIN
│   │   └── constants.js             # HTTP_STATUS, MESSAGES, VALIDATION rules
│   ├── routes/index.js              # Mounts all route files
│   ├── routes/                      # projectRoutes, serviceRoutes, statRoutes,
│   │   …                            #   partnerRoutes, storyRoutes, subscriptionRoutes, userRoutes
│   ├── controllers/                 # One controller per route file
│   ├── middleware/
│   │   ├── responseFormatter.js     # res.sendSuccess() / res.sendError()
│   │   └── errorHandler.js          # notFoundHandler, errorHandler
│   ├── utils/
│   │   ├── fileHandler.js           # ensureUploadDir()
│   │   └── logger.js
│   └── data/                        # JSON flat-files (TEMPORARY — replacing with MongoDB)
│       ├── projects.json
│       ├── services.json
│       ├── stats.json
│       ├── partners.json
│       └── stories.json
│
├── package.json                     # Root: concurrently script only
├── frontend/package.json
└── backend/package.json
```

---

## Key Patterns & Conventions

### Backend responses
Always use the response formatter helpers:
```js
res.sendSuccess(data, "optional message");
res.sendError("error message", HTTP_STATUS.BAD_REQUEST);
```
The `api.js` client unwraps `response.data` automatically.

### Auth (Clerk)
- `useAppAuth()` → `{ user, isAdmin, isLoaded, signOut }`
- `isAdmin` = Clerk public metadata `role === "admin"`
- Admin routes: wrap with `<AdminRoute>` component
- App works without Clerk — check `isClerkConfigured` before using Clerk-specific APIs

### Routing
- Frontend: React Router v6, nested under `<BrowserRouter>`
- Admin dashboard uses nested `<Routes>` inside `AdminDashboard.jsx`
- API: all routes under `/api` prefix

### Styling
- Tailwind utility classes only
- RTL layout (`dir="rtl"`) for Arabic content — most sections use this
- Admin dashboard styles in `frontend/src/styles/admin.css`
- Color palette: blue-600/blue-950 primary, green accents

### Adding a new API endpoint
1. Create `backend/routes/xyzRoutes.js`
2. Create `backend/controllers/xyzController.js`
3. Mount in `backend/routes/index.js`: `router.use("/xyz", require("./xyzRoutes"))`
4. Add export to `frontend/src/services/api.js`

### Adding a new frontend page
1. Create `frontend/src/pages/YourPage.jsx`
2. Add `<Route>` in `App.jsx`
3. If admin-only, wrap with `<AdminRoute>`

---

## Environment Variables

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...        # optional — app works without it
```

### backend/.env
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Local dev (Docker):
MONGODB_URI=mongodb://root:rootsecret@localhost:27017/hamoda_charity?authSource=admin

# Production (Atlas) — swap this in before deploying:
# MONGODB_URI=mongodb+srv://hamoda_app:<password>@cluster0.xxxxx.mongodb.net/hamoda_charity?retryWrites=true&w=majority
```
⚠️ Never commit `.env` — it contains the DB password.

---

## Database Strategy

### Local Development — Docker
- `docker-compose.yml` runs a local MongoDB container
- Connection: `mongodb://root:rootsecret@localhost:27017/hamoda_charity?authSource=admin`
- Each dev runs their own container — no shared state, no internet needed
- Start with `docker compose up -d`, stop with `docker compose down`

### Production — MongoDB Atlas M0 (free tier)
- Swap `MONGODB_URI` in `.env` to the Atlas connection string before deploying
- DB name: `hamoda_charity`
- IP whitelist: restrict to deployment server IP in production
- Atlas auto-pause: cluster sleeps after ~10 min of no traffic (first request wakes it ~10–15 sec)
- Mongoose 8+ handles TLS automatically — no extra config needed

### Mongoose models (not yet created)
| Model | Collection | Status |
|---|---|---|
| Project | projects | ⏳ pending |
| HelpRequest | help_requests | ⏳ pending |
| Donation | donations | ⏳ pending |
| User | users | ⏳ pending |
| Subscription | subscriptions | ⏳ pending |


---

## Feature Status

| Feature | Status | Notes |
|---|---|---|
| Home page (all sections) | ✅ Done | Data from JSON files |
| Admin dashboard UI | ✅ Done | All 7 pages built |
| Clerk auth | ✅ Done | Lazy-loaded, graceful fallback |
| Admin route guard | ✅ Done | `AdminRoute` component |
| Projects page (Mohammad) | ✅ Done | |
| Team page (Mohammad) | ✅ Done | |
| Email subscription | ✅ Done | Saves to JSON |
| MongoDB Atlas connection | ⏳ Pending | Mongoose setup needed |
| Help Request form | ⏳ Pending | Core feature — not started |
| Real donation / payments | ⏳ Pending | Currently → WhatsApp link |
| User profile & history | ⏳ Pending | No profile page yet |
| Admin pages ↔ real DB | ⏳ Pending | Currently mock/static data |
| OpenAI integration | ⏳ Pending | Mentioned in README |
| Stripe / PayPal | ⏳ Pending | Mentioned in README |

---

## Git
```bash
# Recent commits (newest first)
# fix: restore 9 files truncated by PowerShell Set-Content
# chore: delete 8 orphan files, rename home.jsx → HomePage.jsx
# refactor: update all import paths to match renamed folders
# refactor: standardize all file/folder names to MERN convention
```
Main branch is the working branch. Always test both frontend + backend before committing.
