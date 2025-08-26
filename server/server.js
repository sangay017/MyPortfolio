const app = require('./app');
const connectDB = require('./utils/db');

// --- Vercel Serverless Handler ---
module.exports = async (req, res) => {
  try {
    await ensureDB();
    return app(req, res);
  } catch (e) {
    console.error('Handler error:', e);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};

let dbReady = false;
let dbPromise = null;

async function ensureDB() {
  if (dbReady) return;
  if (!dbPromise) {
    dbPromise = connectDB()
      .then(() => {
        dbReady = true;
      })
      .catch((err) => {
        dbPromise = null; // allow retry on next invocation
        throw err;
      });
  }
  await dbPromise;
}

// --- Local Development Bootstrap (replaces local-dev.js) ---
if (require.main === module) {
  // Load .env only for local runs
  try { require('dotenv').config(); } catch {}

  (async function start() {
    try {
      await connectDB();
      const PORT = process.env.PORT || 5000;
      const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} on port ${PORT}`);
      });

      process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection:', err);
        server.close(() => process.exit(1));
      });

      process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        process.exit(1);
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  })();
}
