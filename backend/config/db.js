const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trustlens';
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB optional connection warning: ${error.message}. Running server without active database connection.`);
  }
};

module.exports = connectDB;

