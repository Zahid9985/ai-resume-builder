const express = require('express');
const {
  uploadResume,
  analyzeResume,
  generateResume,
  createResumePdf
} = require('../controllers/resumeController');
const { resumeUpload } = require('../middlewares/upload');

const router = express.Router();

router.post('/upload', resumeUpload.single('resume'), uploadResume);
router.post('/analyze', analyzeResume);
router.post('/generate', generateResume);
router.post('/pdf', createResumePdf);

module.exports = router;
