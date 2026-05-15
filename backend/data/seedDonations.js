// data/seedDonations.js
// ─────────────────────────────────────────────────────────────────────────────
// A seed script that inserts sample donation records into MongoDB.
// Run it ONCE to populate the database for testing and demos:
//
//   node data/seedDonations.js
//
// It wipes the existing donations collection first, then inserts fresh samples.
// DO NOT run this in production — it deletes real data.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();                    // load .env before anything else
const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const connectDB = require('../config/db');

// Sample donations that match the sidebar design in the frontend
const sampleDonations = [
  {
    donationType:  'صدقة',
    amount:        100,
    donorName:     'محمد أحمد',
    donorEmail:    'mohammed@example.com',
    donorPhone:    '+966501234567',
    donorCity:     'الرياض',
    paymentMethod: 'stripe',
    status:        'completed',
  },
  {
    donationType:  'صدقة',
    amount:        1000,
    donorName:     'يوسف المحطاني',
    donorEmail:    'yousef@example.com',
    donorPhone:    '+966507654321',
    donorCity:     'جدة',
    paymentMethod: 'paypal',
    status:        'completed',
  },
  {
    donationType:  'زكاة',
    amount:        250,
    donorName:     'سارة المظري',
    donorEmail:    'sara@example.com',
    donorPhone:    '+970591234567',
    donorCity:     'نابلس',
    paymentMethod: 'stripe',
    status:        'completed',
  },
  {
    donationType:  'زكاة',
    amount:        500,
    donorName:     'أحمد محمد علي',
    donorEmail:    'ahmed@example.com',
    donorPhone:    '+970598765432',
    donorCity:     'رام الله',
    paymentMethod: 'cash',
    status:        'completed',
  },
  {
    donationType:  'صدقة',
    amount:        100,
    donorName:     'فاطمة إبراهيم',
    donorEmail:    'fatima@example.com',
    donorPhone:    '+966509876543',
    donorCity:     'الدمام',
    paymentMethod: 'stripe',
    status:        'completed',
  },
  {
    donationType:  'إغاثة',
    amount:        250,
    donorName:     'محمد عبدالله',
    donorEmail:    'mabdullah@example.com',
    donorPhone:    '+970592345678',
    donorCity:     'القدس',
    paymentMethod: 'paypal',
    status:        'completed',
  },
  {
    donationType:  'تعليم',
    amount:        2500,
    donorName:     'خالد العمري',
    donorEmail:    'khalid@example.com',
    donorPhone:    '+966503456789',
    donorCity:     'المدينة المنورة',
    paymentMethod: 'stripe',
    status:        'pending',
  },
  {
    donationType:  'علاج',
    amount:        50,
    donorName:     'نور الحسن',
    donorEmail:    'nour@example.com',
    donorPhone:    '+970594567890',
    donorCity:     'طولكرم',
    paymentMethod: 'cash',
    status:        'completed',
  },
  {
    donationType:  'إسكان',
    amount:        500,
    donorName:     'عمر الزيود',
    donorEmail:    'omar@example.com',
    donorPhone:    '+962791234567',
    donorCity:     'عمان',
    paymentMethod: 'paypal',
    status:        'completed',
  },
];

async function seedDatabase() {
  await connectDB();

  try {
    // Delete all existing records first
    await Donation.deleteMany({});
    console.log('🗑️  Existing donations cleared');

    // Insert all sample records
    const inserted = await Donation.insertMany(sampleDonations);
    console.log(`✅ ${inserted.length} sample donations inserted successfully`);

    // Print a quick summary
    const totalAmount = sampleDonations.reduce((sum, d) => sum + d.amount, 0);
    console.log(`💰 Total seeded amount: $${totalAmount.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

seedDatabase();
