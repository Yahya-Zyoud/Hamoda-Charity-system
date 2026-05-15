require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const Partner  = require("../models/Partner");
const Service  = require("../models/Service");
const Stat     = require("../models/Stat");
const Story    = require("../models/Story");
const Project  = require("../models/Project");
const Team     = require("../models/Team");

const loadJson = (filename) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, "data", filename), "utf-8"));

async function seedCollection(Model, filename, label) {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`  ${label}: already seeded (${count} docs), skipping`);
    return;
  }
  const data = loadJson(filename);
  await Model.insertMany(data);
  console.log(`  ${label}: seeded ${data.length} docs`);
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB\n");

  await seedCollection(Partner, "partners.json", "Partners");
  await seedCollection(Service, "services.json", "Services");
  await seedCollection(Stat,    "stats.json",    "Stats");
  await seedCollection(Story,   "stories.json",  "Stories");
  await seedCollection(Project, "projects.json", "Projects");
  await seedCollection(Team,    "team.json",     "Team");

  console.log("\nSeed complete");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
