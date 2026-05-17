/**
 * Master seed script — run once to populate all collections from JSON files.
 * Usage (from the backend/ folder):
 *   node data/seed.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const path     = require("path");

const Project  = require("../models/Project");
const Service  = require("../models/Service");
const Stat     = require("../models/Stat");
const Partner  = require("../models/Partner");

const projects = require("./projects.json");
const services = require("./services.json");
const stats    = require("./stats.json");
const partners = require("./partners.json");

async function seedCollection(Model, data, name) {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`  ⏭  ${name}: already has ${count} docs — skipping`);
    return;
  }
  const inserted = await Model.insertMany(data.map(({ id, ...rest }) => rest));
  console.log(`  ✅ ${name}: inserted ${inserted.length} docs`);
}

async function main() {
  console.log("\n🌱 Starting seed...\n");

  await mongoose.connect(process.env.MONGO_URI);
  console.log("  🔗 Connected to MongoDB\n");

  await seedCollection(Project, projects, "Projects");
  await seedCollection(Service, services, "Services");
  await seedCollection(Stat,    stats,    "Stats");
  await seedCollection(Partner, partners, "Partners");

  console.log("\n✅ Seed complete.\n");
  await mongoose.connection.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
