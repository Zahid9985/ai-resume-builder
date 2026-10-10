const puppeteer = require('puppeteer');
const { env } = require('../config/env');
const { renderResumeHtml } = require('./pdfTemplateService');

async function generateResumePdf(resume, template) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(renderResumeHtml(resume, template), { waitUntil: 'networkidle0' });
    return page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = { generateResumePdf };
