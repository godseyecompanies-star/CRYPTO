const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');
// Referral system enabled

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http://localhost:*', 'http://192.168.*:*'], // Allow local network images
      connectSrc: ["'self'", 'http://localhost:*', 'http://192.168.*:*'],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Login rate limiting (more strict)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login requests per windowMs (increased for development)
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true,
});

// Apply rate limiting to all requests
app.use(limiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', loginLimiter);

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.31.164:3000',
  process.env.CLIENT_URL // This will be your Netlify URL in production
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Direct QR code route (MUST be before /uploads middleware)
app.get('/uploads/payment-qr-code.png', (req, res) => {
  const fs = require('fs');
  const qrPath = path.join(__dirname, 'uploads', 'payment-qr-code.png');
  
  console.log('🎯 Direct QR request - Full path:', qrPath);
  console.log('🎯 File exists?', fs.existsSync(qrPath));
  console.log('🎯 Request origin:', req.headers.origin);
  
  if (fs.existsSync(qrPath)) {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.sendFile(qrPath);
  } else {
    res.status(404).json({ error: 'QR code not found', path: qrPath });
  }
});

// Serve uploaded files with no-cache headers for QR code
app.use('/uploads', (req, res, next) => {
  console.log('📥 File request:', req.url);
  console.log('📂 Serving from:', path.join(__dirname, 'uploads'));
  
  // Disable caching for QR code image
  if (req.url.includes('payment-qr-code')) {
    console.log('🔄 No-cache headers applied for QR code');
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
  }
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/coins', require('./routes/coins'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/support', require('./routes/support'));

// Test QR code endpoint
app.get('/test-qr', (req, res) => {
  const fs = require('fs');
  const qrPath = path.join(__dirname, 'uploads', 'payment-qr-code.png');
  
  if (fs.existsSync(qrPath)) {
    const stats = fs.statSync(qrPath);
    res.json({
      exists: true,
      path: qrPath,
      size: stats.size,
      modified: stats.mtime,
      url: '/uploads/payment-qr-code.png',
      fullUrl: `http://192.168.31.164:5000/uploads/payment-qr-code.png?t=${Date.now()}`
    });
  } else {
    res.json({ exists: false, path: qrPath });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'CryptoCoins API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
