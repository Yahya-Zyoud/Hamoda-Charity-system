// config/db.js
// ─────────────────────────────────────────────────────────────────────────────
// Connects to MongoDB using Mongoose.
// Called once from server.js at startup.
//
// Uses the MONGO_URI value from the .env file.
// If connection fails, the process exits so the server doesn't run without a DB.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

async function connectDB() {
  // Guard: if MONGO_URI was never set in .env, fail immediately with a clear message
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in your .env file.');
    console.error('   Create a .env file in the backend folder and add:');
    console.error('   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/charity_db');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These two options silence deprecation warnings in Mongoose 7/8
      serverSelectionTimeoutMS: 10000,  // give up connecting after 10 seconds
      socketTimeoutMS: 45000,           // close idle sockets after 45 seconds
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);

    // Give the developer a helpful hint based on the error type
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   → MongoDB is not running locally.');
      console.error('   → Use MongoDB Atlas instead (free cloud DB).');
      console.error('   → See the .env.example file for how to set the Atlas URI.');
    }

    if (error.message.includes('authentication failed')) {
      console.error('   → Wrong MongoDB username or password in MONGO_URI.');
    }

    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('   → Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('   → Go to Atlas → Network Access → Add IP Address → Allow from Anywhere.');
    }

    process.exit(1);
  }
}

module.exports = connectDB;
