const { extractResumeText } = require('../services/resumeParser');
const { cleanupFile } = require('../services/tempFileService');
const { analyzeResumeWithAi, generateTailoredResumeWithAi } = require('../ai/resumeAiService');
const { generateResumePdf } = require('../services/pdfService');
const { AppError } = require('../utils/AppError');
const {
  analyzeRequestSchema,
  generateRequestSchema,
  pdfRequestSchema
} = require('../validation/resumeSchemas');
const {
  saveMasterResume,
  saveAnalysis,
  saveGeneratedResume
} = require('../services/resumePersistenceService');

function validate(schema, body) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new AppError('Invalid request payload.', 400, parsed.error.flatten());
  return parsed.data;
}

async function uploadResume(req, res, next) {
  try {
    const resumeText = await extractResumeText(req.file);
    const saved = await saveMasterResume({
      originalFileName: req.file.originalname,
      fileType: req.file.mimetype,
      extractedText: resumeText
    });

    res.json({
      success: true,
      data: {
        resumeText,
        masterResumeId: saved?._id || null,
        originalFileName: req.file.originalname,
        characterCount: resumeText.length
      }
    });
  } catch (error) {
    next(error);
  } finally {
    await cleanupFile(req.file?.path);
  }
}

async function analyzeResume(req, res, next) {
  try {
    const payload = validate(analyzeRequestSchema, req.body);
    const analysis = await analyzeResumeWithAi(payload);
    const saved = await saveAnalysis({
      masterResumeId: req.body.masterResumeId,
      jobDescription: payload.jobDescription,
      result: analysis
    });
    res.json({ success: true, data: { analysis, analysisId: saved?._id || null } });
  } catch (error) {
    next(error);
  }
}

async function generateResume(req, res, next) {
  try {
    const payload = validate(generateRequestSchema, req.body);
    const resume = await generateTailoredResumeWithAi(payload);
    const saved = await saveGeneratedResume({
      masterResumeId: req.body.masterResumeId,
      analysisId: req.body.analysisId,
      resume
    });
    res.json({ success: true, data: { resume, generatedResumeId: saved?._id || null } });
  } catch (error) {
    next(error);
  }
}

async function createResumePdf(req, res, next) {
  try {
    const payload = validate(pdfRequestSchema, req.body);
    const pdf = await generateResumePdf(payload.resume, payload.template);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="tailored-resume.pdf"');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadResume, analyzeResume, generateResume, createResumePdf };
