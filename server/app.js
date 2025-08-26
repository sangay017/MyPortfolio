const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const chatRoutes = require('./routes/chat');

// Initialize express app
const app = express();

// Middleware
// Behind Vercel proxy
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// File upload middleware: only buffers in memory (no local filesystem)
app.use(fileupload({
  createParentPath: false,
  limits: { fileSize: 2 * 1024 * 1024 },
  useTempFiles: false,
  safeFileNames: true,
  preserveExtension: true,
  abortOnLimit: true,
  responseOnLimit: 'File size limit has been reached',
  uploadTimeout: 60000
}));

// CORS configuration (supports comma-separated list in FRONTEND_URL)
const FRONTEND_URL = process.env.FRONTEND_URL;
const ALLOWED_ORIGINS = FRONTEND_URL
  ? FRONTEND_URL.split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  .map((s) => s.replace(/^['"]|['"]$/g, ''))
  .map((s) => s.replace(/\/$/, '').toLowerCase())
  : [];

// Build regex list for wildcard patterns like https://*.vercel.app
const originMatchers = ALLOWED_ORIGINS.map((o) => {
  if (o === '*' || o === 'true') return { type: 'any' };
  if (o.includes('*')) {
    const pattern = o
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\*/g, '.*');
    return { type: 'regex', re: new RegExp(`^${pattern}$`, 'i') };
  }
  return { type: 'exact', value: o };
});

const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin or tools with no origin (curl/postman)
    if (!origin) return callback(null, true);

    // If no env configured, allow the requester's origin (same-site deployments)
    if (originMatchers.length === 0) {
      return callback(null, true);
    }

    const normalized = origin.replace(/\/$/, '').toLowerCase();
    for (const m of originMatchers) {
      if (m.type === 'any') return callback(null, true);
      if (m.type === 'exact' && normalized === m.value) return callback(null, true);
      if (m.type === 'regex' && m.re.test(normalized)) return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
// Explicitly handle preflight for any route (Express 5: use regex, not '*')
app.options(/.*/, cors(corsOptions));

// Routes
// Health checks
app.get('/', (req, res) => {
  res.status(200).json({ ok: true, message: 'Backend running', version: 'v1' });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});
app.get('/api', (req, res) => {
  res.status(200).json({ ok: true, message: 'API is up' });
});

// API index helper
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    ok: true,
    routes: [
      'GET /api/health',
      'GET /api',
      'GET /api/v1',
      'POST /api/v1/auth/register',
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/logout',
      'GET /api/v1/auth/me',
      'GET /api/v1/projects',
      'POST /api/v1/projects',
      'GET /api/v1/projects/:id',
      'PUT /api/v1/projects/:id',
      'DELETE /api/v1/projects/:id',
      'GET /api/v1/projects/:id/image',
      'POST /api/v1/contact',
      'POST /api/v1/chat'
    ]
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/chat', chatRoutes);

// Note: No local static file serving needed for uploads; images served via DB endpoint

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
