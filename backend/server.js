import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import { notFoundHandler, errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────────────────
// Logging Middleware
// ──────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ──────────────────────────────────────────────────────────
// Security Middlewares
// ──────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.CLIENT_ADMIN_URL, process.env.CLIENT_PUBLIC_URL].filter(Boolean)
      : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ──────────────────────────────────────────────────────────
// Rate Limiting
// ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// ──────────────────────────────────────────────────────────
// Body Parsing Middlewares
// ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ──────────────────────────────────────────────────────────
// Health Check Endpoint
// ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'RenewCred Backend API',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ──────────────────────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);

// ──────────────────────────────────────────────────────────
// Error Handling
// ──────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ──────────────────────────────────────────────────────────
// Start Server & Graceful Lifecycle Management
// ──────────────────────────────────────────────────────────
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(
      `[RenewCred Backend] ✓ Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`
    );
  });

  /**
   * Graceful shutdown handler.
   * Stops accepting new connections, waits for active requests to complete,
   * then exits. This prevents data corruption on SIGTERM (k8s, Docker stop).
   */
  const shutdown = (signal) => {
    console.log(`\n[RenewCred Backend] ${signal} received — initiating graceful shutdown...`);
    server.close((err) => {
      if (err) {
        console.error('[RenewCred Backend] Error during shutdown:', err.message);
        process.exit(1);
      }
      console.log('[RenewCred Backend] HTTP server closed. Goodbye.');
      process.exit(0);
    });

    // Force-kill if shutdown takes longer than 10 seconds
    setTimeout(() => {
      console.error('[RenewCred Backend] Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
});

// ──────────────────────────────────────────────────────────
// Global Process Error Guards
// ──────────────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('[RenewCred Backend] Unhandled Promise Rejection:', reason);
  // In production, exit so the process manager can restart cleanly
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[RenewCred Backend] Uncaught Exception:', err.message);
  process.exit(1);
});
