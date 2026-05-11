const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./models/db");
const helpRequestRoutes = require("./router/helpRequestRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/help-requests", helpRequestRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});