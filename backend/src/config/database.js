const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDatabase() {
  if (env.NODE_ENV === 'test') return null;
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    console.warn('MongoDB unavailable; guest workflows will run without persistence.');
    return null;
  }
}

module.exports = { connectDatabase };
