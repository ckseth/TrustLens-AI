const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../')));

// Health Check API Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TrustLens API is running'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/comparison', require('./routes/comparisonRoutes'));
app.use('/api/privacy', require('./routes/privacyRoutes'));

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TrustLens server running on port ${PORT}`);
});
