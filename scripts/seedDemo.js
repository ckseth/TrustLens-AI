const path = require('path');
// Ensure scripts directory resolves packages from backend/node_modules
module.paths.push(path.join(__dirname, '../backend/node_modules'));

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config();

const User = require('../backend/models/User');

const DEMO_EMAIL = 'demo.user@trustlens.ai';
const DEMO_PASSWORD = 'Password@123';

const seedDemo = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trustlens';

  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Refusing to seed the public demo account in production.');
    }

    await mongoose.connect(mongoURI);
    let demoUser = await User.findOne({ email: DEMO_EMAIL });

    if (demoUser && demoUser.role === 'admin') {
      throw new Error(`Refusing to replace admin account ${DEMO_EMAIL} with a demo user.`);
    }

    if (!demoUser) {
      demoUser = new User({
        name: 'TrustLens Demo User',
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD
      });
    } else {
      demoUser.password = DEMO_PASSWORD;
    }

    demoUser.name = 'TrustLens Demo User';
    demoUser.role = 'user';
    demoUser.emailVerified = true;
    demoUser.isVerified = true;
    demoUser.isActive = true;
    demoUser.resetPasswordToken = null;
    demoUser.resetPasswordTokenExpires = null;
    await demoUser.save();

    console.log(`[Seed] Demo account is ready: ${DEMO_EMAIL}`);
  } catch (error) {
    console.error('[Seed] Error creating demo account:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDemo();
