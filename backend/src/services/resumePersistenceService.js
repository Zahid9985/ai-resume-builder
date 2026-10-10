const mongoose = require('mongoose');
const MasterResume = require('../models/MasterResume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const GeneratedResume = require('../models/GeneratedResume');
const { hashText } = require('../utils/hash');

function canPersist() {
  return mongoose.connection.readyState === 1;
}

async function saveMasterResume({ originalFileName, fileType, extractedText }) {
  if (!canPersist()) return null;
  return MasterResume.create({
    originalFileName,
    fileType,
    extractedTextHash: hashText(extractedText),
    extractedTextPreview: extractedText.slice(0, 500)
  });
}

async function saveAnalysis({ masterResumeId, jobDescription, result }) {
  if (!canPersist()) return null;
  return ResumeAnalysis.create({
    masterResumeId,
    jobDescriptionHash: hashText(jobDescription),
    result
  });
}

async function saveGeneratedResume({ masterResumeId, analysisId, resume, template = 'classic' }) {
  if (!canPersist()) return null;
  return GeneratedResume.create({ masterResumeId, analysisId, resume, template });
}

module.exports = { saveMasterResume, saveAnalysis, saveGeneratedResume };
