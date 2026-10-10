const fs = require('fs/promises');

async function cleanupFile(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Temporary file cleanup failed:', error.message);
    }
  }
}

module.exports = { cleanupFile };
