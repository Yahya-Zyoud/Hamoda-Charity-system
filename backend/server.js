const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
require("dotenv").config();

const teamRouter    = require("./router/teamRouter");
const projectRouter = require("./router/projectRouter");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.use("/api/team",     teamRouter);
app.use("/api/projects", projectRouter);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// ── MongoDB + Listen ──────────────────────────────────────
const PORT      = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hamoudeh";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });