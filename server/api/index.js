const app = require('../app');
const connectDB = require('../utils/db');

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
// Vercel Node.js Serverless Function handler
