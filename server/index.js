const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React app static files (for production)
// Support both development structure (../client/build) and deployment structure (../public)
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../public');
  const buildPath = path.join(__dirname, '../client/build');
  
  // Check if public folder exists (deployment structure)
  if (require('fs').existsSync(publicPath)) {
    app.use(express.static(publicPath));
  } else if (require('fs').existsSync(buildPath)) {
    // Fallback to development build structure
    app.use(express.static(buildPath));
  }
}

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Database initialization
const db = require('./database/db');

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/churches', require('./routes/churches'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/provinces', require('./routes/provinces'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve React app for all non-API routes (production only)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      const publicIndex = path.join(__dirname, '../public/index.html');
      const buildIndex = path.join(__dirname, '../client/build/index.html');
      
      // Check if public folder exists (deployment structure)
      if (require('fs').existsSync(publicIndex)) {
        res.sendFile(publicIndex);
      } else if (require('fs').existsSync(buildIndex)) {
        // Fallback to development build structure
        res.sendFile(buildIndex);
      } else {
        res.status(404).send('Frontend build not found');
      }
    }
  });
}

// Initialize database and start server
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

