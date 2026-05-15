// server.js
// ─────────────────────────────────────────────────────────────────────────────
// Main entry point for the backend.
// Order matters: middleware → routes → error handler.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();   // MUST be first line — loads .env into process.env

const express         = require('express');
const cors            = require('cors');
const connectDB       = require('./config/db');
const donationRouter  = require('./router/donationRouter');
const errorHandler    = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── 1. Connect to MongoDB ─────────────────────────────────────────────────
connectDB();

// ── 2. Global Middleware ──────────────────────────────────────────────────

// CORS — allow requests from the React frontend.
// Supports Vite (port 5173) AND Create React App (port 3000).
// CLIENT_URL in .env overrides both defaults.
const allowedOrigins = [
  process.env.CLIENT_URL,     // from .env — highest priority
  'http://localhost:5173',    // Vite default  ← your current frontend
  'http://localhost:3000',    // CRA / other setups
].filter(Boolean);            // removes undefined if CLIENT_URL not set

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin header (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin "${origin}" is not allowed.`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Parse incoming JSON request bodies into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── 3. Routes ─────────────────────────────────────────────────────────────

// Health-check — open http://localhost:5000/api in your browser to verify
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Hamoda-Charity backend is running! 🌟',
    mongoStatus: require('mongoose').connection.readyState === 1
      ? 'connected' : 'disconnected',
  });
});

// All /api/donations/* endpoints
app.use('/api/donations', donationRouter);

// 404 — any route not matched above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `المسار ${req.originalUrl} غير موجود`,
  });
});

// ── 4. Global Error Handler (MUST be last) ────────────────────────────────
app.use(errorHandler);

// ── 5. Start Listening ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running  → http://localhost:${PORT}`);
  console.log(`📡 Donations API   → http://localhost:${PORT}/api/donations`);
  console.log(`🔍 Health check    → http://localhost:${PORT}/api\n`);
});
