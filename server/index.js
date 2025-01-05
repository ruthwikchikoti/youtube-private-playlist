require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./src/routes/auth.routes');
const youtubeRoutes = require('./src/routes/youtube.routes');
const errorMiddleware = require('./src/middleware/error.middleware');
const layoutRoutes = require('./src/routes/layout.routes');

const app = express();

// Middleware setup
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://accounts.google.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));

// Custom request logger with query params
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('Query params:', req.query);
  }
  if (Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  if (req.headers.authorization) {
    console.log('Auth header present');
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/youtube', youtubeRoutes);  
app.use('/layout', layoutRoutes);

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /auth/send-otp': 'Send OTP to email',
        'POST /auth/verify-otp': 'Verify OTP and get token'
      },
      youtube: {
        'GET /youtube/auth-url': 'Get YouTube OAuth URL',
        'GET /youtube/playlists': 'Get user\'s YouTube playlists',
        'GET /youtube/playlist/:id/videos': 'Get videos in playlist'
      }
    }
  });
});

// Error handling middleware
app.use(errorMiddleware);

app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: `Route ${req.method} ${req.path} not found` 
  });
});

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Server startup function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✓ Connected to MongoDB');
    // Print MongoDB connection info and data

    // Start Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('\n=================================');
      console.log(`Server Information:`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log(`✓ Server running on port: ${PORT}`);
      console.log(`✓ API URL: http://localhost:${PORT}`);
      console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log('=================================\n');

      // Log available routes
      console.log('Available Routes:');
      console.log('- POST /auth/send-otp');
      console.log('- POST /auth/verify-otp');
      console.log('- GET  /youtube/auth-url');
      console.log('- GET  /youtube/playlists');
      console.log('- GET  /youtube/playlist/:id/videos');
      console.log('- GET  /health');
      console.log('- GET  /api-docs\n');
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    params: req.params,
    query: req.query
  });
  next();
});
startServer();