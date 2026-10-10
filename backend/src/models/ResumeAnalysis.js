const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', default: null },
  masterResumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterResume', default: null },
  jobDescriptionHash: String,
  result: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
