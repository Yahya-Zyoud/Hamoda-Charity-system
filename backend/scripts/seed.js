// Seed script for the scripts/ directory — populates Projects from the dataLoader utility. Run once on fresh deployments.
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { loadData } = require("../utils/dataLoader");

const Project = require("../models/Project");
const Subscription = require("../models/Subscription");

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Only insert projects if the collection is empty to avoid duplicates.
  const existingProjects = await Project.countDocuments();
  if (existingProjects === 0) {
    const data = loadData("projects");
    await Project.insertMany(data);
    console.log(`Seeded ${data.length} projects`);
  } else {
    console.log(`Projects already seeded (${existingProjects} found), skipping`);
  }

  // Subscriptions — nothing to seed (no initial data)
  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
