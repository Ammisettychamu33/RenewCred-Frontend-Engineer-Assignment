import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB and attaches lifecycle event listeners
 * so connection health is visible in logs at all times.
 */
export const connectDB = async () => {
  // ── Connection event listeners ────────────────────────────
  mongoose.connection.on('connected', () => {
    console.log('[MongoDB] ✓ Connection established');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] ✗ Connection lost — waiting for reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] ✓ Connection re-established');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Connection error:', err.message);
  });

  // ── Initial connect ───────────────────────────────────────
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/renewcred_cms',
      {
        serverSelectionTimeoutMS: 5000, // fail fast if Mongo is unreachable
      }
    );
    console.log(`[MongoDB] ✓ Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Initial connection failed: ${error.message}`);
    process.exit(1);
  }
};
