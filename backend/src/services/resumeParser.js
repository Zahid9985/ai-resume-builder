const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { AppError } = require('../utils/AppError');

function normalizeText(text) {
  return String(text || '')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function extractPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const parsed = await pdfParse(buffer);
  return normalizeText(parsed.text);
}

async function extractDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return normalizeText(result.value);
}

async function extractResumeText(file) {
  if (!file) throw new AppError('Resume file is required.', 400);

  let text = '';
  if (file.mimetype === 'application/pdf') {
    text = await extractPdf(file.path);
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await extractDocx(file.path);
  } else {
    throw new AppError('Unsupported resume file type.', 400);
  }

  if (text.length < 100) {
    throw new AppError('Could not extract enough text. Scanned PDFs are not supported in this MVP.', 422);
  }

  return text;
}

module.exports = { extractResumeText, normalizeText };
