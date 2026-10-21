const { app } = require('./app');
const { env } = require('./config/env');
const { connectDatabase } = require('./config/database');

async function start() {
  const server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });

  // Keep the guest API available while MongoDB is connecting or unavailable.
  // Persistence operations already skip writes until the connection is ready.
  connectDatabase().catch((error) => {
    console.warn('MongoDB connection could not be established:', error.message);
  });

  return server;
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
