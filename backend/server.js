const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
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

// Serve Frontend Static Files (from frontend/ or root fallback)
const frontendPath = path.join(__dirname, '../frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
} else {
  app.use(express.static(path.join(__dirname, '../')));
}

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

const http = require('http');
const PORT = parseInt(process.env.PORT, 10) || 5000;

function startServer(port) {
  const server = http.createServer(app);
  server.on('error', (err) => {
    if ((err.code === 'EADDRINUSE' || err.code === 'EACCES') && port < 5010) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is unavailable (${err.code}). Retrying on port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error(`Failed to start server on port ${port}:`, err);
    }
  });
  server.listen(port, () => {
    console.log(`TrustLens server running on port ${port}`);
  });
}

startServer(PORT);
