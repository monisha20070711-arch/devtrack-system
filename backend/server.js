/**
 * DevTrack - Main Express Server Entry Point
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { initializeDatabase } = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const issueRoutes = require('./routes/issueRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Request Parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Catch-all route to serve SPA frontend
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server after initializing DB pool
async function startServer() {
  await initializeDatabase();
  
  const HOST = '0.0.0.0';
  const server = app.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(` DevTrack System Server active on http://localhost:${PORT}`);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(` API Endpoint: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const ALT_PORT = parseInt(PORT, 10) + 1;
      console.warn(`[Port Notice] Port ${PORT} is busy, switching to http://localhost:${ALT_PORT}...`);
      app.listen(ALT_PORT, HOST, () => {
        console.log(`=======================================================`);
        console.log(` DevTrack System Server active on http://localhost:${ALT_PORT}`);
        console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
        console.log(` API Endpoint: http://localhost:${ALT_PORT}/api`);
        console.log(`=======================================================`);
      });
    } else {
      console.error('[Server Error]', err);
    }
  });
}

startServer();
