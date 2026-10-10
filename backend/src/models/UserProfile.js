const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  email: { type: String, index: true, sparse: true },
  name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
