const crypto = require('crypto');

function hashText(text) {
  return crypto.createHash('sha256').update(String(text || '')).digest('hex');
}

module.exports = { hashText };
