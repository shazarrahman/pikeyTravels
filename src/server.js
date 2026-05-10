require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const connectDB = require('./config/db');

const app = express();

connectDB();

const LOG_DIR = path.resolve(__dirname, '..');
const BACKEND_LOG = path.join(LOG_DIR, 'dev_back.log');
const FRONTEND_LOG = path.join(LOG_DIR, 'dev_front.log');

// Helper: Append to log file
const writeLog = (filePath, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFile(filePath, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
};

// Capture uncaught exceptions & unhandled rejections
process.on('uncaughtException', (err) => {
  const msg = `Uncaught Exception: ${err.message}\nStack: ${err.stack}\n`;
  console.error(msg);
  writeLog(BACKEND_LOG, msg);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  const msg = `Unhandled Rejection: ${reason}\n`;
  console.error(msg);
  writeLog(BACKEND_LOG, msg);
});

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api', limiter);

app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/addons', require('./routes/addonRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/site-settings', require('./routes/siteSettingsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PikeyTravels API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Endpoint for frontend error logging
app.post('/api/logs/frontend', (req, res) => {
  const { error, componentStack, additionalInfo } = req.body;
  const logEntry = `[${new Date().toISOString()}] ${error}\n${componentStack || ''}\n${additionalInfo ? 'Additional: ' + JSON.stringify(additionalInfo) : ''}\n---\n`;
  writeLog(FRONTEND_LOG, logEntry);
  res.json({ success: true });
});

app.use((req, res) => {
  const msg = `404 Not Found: ${req.originalUrl}`;
  writeLog(BACKEND_LOG, msg);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  const errorMsg = `Error: ${err.message}\nStack: ${err.stack}\nURL: ${req.originalUrl}\nMethod: ${req.method}\n`;
  console.error(errorMsg);
  writeLog(BACKEND_LOG, errorMsg);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Backend log: ${BACKEND_LOG}`);
  console.log(`Frontend log: ${FRONTEND_LOG}`);
});