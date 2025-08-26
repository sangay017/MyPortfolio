const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI.replace(/['"]+/g, '');
    const connectionString = uri.includes('retryWrites')
      ? uri
      : `${uri}${uri.includes('?') ? '&' : '?'}retryWrites=true&w=majority`;

    cached.promise = mongoose
      .connect(connectionString, {
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 60000,
        family: 4,
        appName: 'portfolio-server'
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
