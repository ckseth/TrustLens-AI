const path = require('path');
// Ensure scripts directory resolves packages from backend/node_modules
module.paths.push(path.join(__dirname, '../backend/node_modules'));

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config();

const User = require('../backend/models/User');

const seedAdmin = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trustlens';
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@trustlens.ai').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@TrustLens2026';
  const adminName = process.env.ADMIN_NAME || 'TrustLens Administrator';

  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB.');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.emailVerified = true;
        existingAdmin.isVerified = true;
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log(`[Seed] Existing user "${adminEmail}" promoted to admin role.`);
      } else {
        console.log(`[Seed] Admin user "${adminEmail}" already exists. No changes required.`);
      }
    } else {
      // User pre-save hook in User.js automatically hashes password if modified,
      // but if creating directly with User.create, pre('save') handles it.
      const newAdmin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        emailVerified: true,
        isVerified: true,
        isActive: true,
        otpHash: null,
        otpExpiresAt: null
      });

      console.log(`[Seed] Admin account created successfully!`);
      console.log(`[Seed] Email: ${newAdmin.email}`);
      console.log(`[Seed] Role:  ${newAdmin.role}`);
    }

    await mongoose.connection.close();
    console.log('[Seed] MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding admin:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedAdmin();
