const mongoose = require('mongoose');

const generatedResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', default: null },
  masterResumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterResume', default: null },
  analysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResumeAnalysis', default: null },
  template: { type: String, default: 'classic' },
  resume: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeneratedResume', generatedResumeSchema);
