const mongoose = require('mongoose');

const masterResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', default: null },
  originalFileName: String,
  fileType: String,
  extractedTextHash: String,
  extractedTextPreview: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MasterResume', masterResumeSchema);
