const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'ai-resume-api' } });
});

module.exports = router;
