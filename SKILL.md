# Hamoda Charity — Claude Skill File
# Read this before touching any code. It tells you exactly how to do common tasks.

## Role
You are working on an academic Arabic charity web platform.
Stack: React 18 + Vite + Tailwind (frontend) | Node.js + Express (backend) | MongoDB via Mongoose | Clerk auth.
All user-facing text is in Arabic. All layouts use `dir="rtl"`.
Always run both servers when testing: `npm run dev` from root.

---

## 1. Add a Backend Endpoint

```
backend/routes/xyzRoutes.js           ← define routes
backend/controllers/xyzController.js  ← logic
backend/routes/index.js               ← mount: router.use("/xyz", require("./xyzRoutes"))
frontend/src/services/api.js          ← add export
```

**Controller template:**
```js
const { HTTP_STATUS } = require("../config/constants");

exports.getAll = async (req, res) => {
  try {
    // ... logic
    res.sendSuccess(data);
  } catch (err) {
    res.sendError(err.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
```

**Always use `res.sendSuccess()` / `res.sendError()` — never `res.json()` directly.**
The `api.js` client auto-unwraps `response.data`.

---

## 2. Add a Mongoose Model

Create `backend/models/XyzModel.js`:
```js
const mongoose = require("mongoose");

const xyzSchema = new mongoose.Schema({
  field: { type: String, required: true, trim: true },
  // ...
}, { timestamps: true });

module.exports = mongoose.model("Xyz", xyzSchema);
```

Collections map: Project → `projects`, HelpRequest → `help_requests`,
Donation → `donations`, User → `users`, Subscription → `subscriptions`.

---

## 3. Add a Frontend Page

```
frontend/src/pages/YourPage.jsx   ← create page
frontend/src/App.jsx              ← add <Route path="/your-path" element={<YourPage />} />
```
If admin-only: wrap with `<AdminRoute>`.
If Arabic/RTL: add `dir="rtl"` on the top-level section.

---

## 4. Add an Admin Dashboard Page

1. Create `frontend/src/pages/admin/YourPage.jsx`
2. Import shared components from `frontend/src/components/admin/`:
   `DashboardLayout, Card, Btn, Badge, Input, Modal, Select, StatCard, FilterTabs, TableParts`
3. Add route in `AdminDashboard.jsx`:
   ```jsx
   <Route path="your-path" element={<YourPage />} />
   ```
4. Add link in `Sidebar.jsx`

---

## 5. Auth Patterns

```jsx
// Read user/role in any component:
const { user, isAdmin, isLoaded, signOut } = useAppAuth();

// Guard a component:
if (!isLoaded) return null;
if (!isAdmin) return <Navigate to="/" replace />;

// Check if Clerk is configured before using Clerk APIs:
import { isClerkConfigured } from "../lib/clerkConfig";
if (isClerkConfigured) { /* use Clerk-specific APIs */ }
```

---

## 6. Database — Local vs Production

| | Local Dev | Production |
|---|---|---|
| Engine | Docker container | MongoDB Atlas M0 |
| URI | `mongodb://root:rootsecret@localhost:27017/hamoda_charity?authSource=admin` | Atlas URI in `.env` |
| Start | `docker compose up -d` | always-on |
| Mongoose code | identical | identical |

**Connecting in `server.js`:**
```js
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch(err => { logger.error("MongoDB error", err); process.exit(1); });
```

---

## 7. Environment Files

**Never commit `.env`.** Template for teammates:

`backend/.env`:
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://root:rootsecret@localhost:27017/hamoda_charity?authSource=admin
```

`frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## 8. Styling Rules

- Tailwind only — no custom CSS except `styles/admin.css` for dashboard
- Color palette: `blue-600` / `blue-950` primary, green accents
- Arabic text: `font-tajawal`, `dir="rtl"` on section wrapper
- Animations: Framer Motion for page sections, Tailwind `animate-*` for small effects

---

## 9. API Call Pattern (Frontend)

```js
// In a component:
const [data, setData] = useState([]);
useEffect(() => {
  getXyz().then(setData).catch(console.error);
}, []);
```

All API functions live in `frontend/src/services/api.js`.
`BASE_URL` = `VITE_API_URL` env var (defaults to `/api`).

---

## 10. Pending Features Checklist

- [ ] `docker-compose.yml` — MongoDB local container
- [ ] `backend/db.js` — Mongoose connect helper
- [ ] Mongoose models: Project, HelpRequest, Donation, User, Subscription
- [ ] Migrate JSON-file controllers → Mongoose
- [ ] Help Request form + `/api/requests` endpoint
- [ ] Real donation flow (Stripe or PayPal)
- [ ] User profile page + donation history
- [ ] Wire admin pages to live DB data
- [ ] OpenAI integration (request classification / chatbot)
- [ ] Deploy backend (Render/Railway) + swap MONGODB_URI to Atlas
