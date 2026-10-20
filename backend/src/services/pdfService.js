const puppeteer = require('puppeteer');
const fs = require('node:fs');
const path = require('node:path');
const { env } = require('../config/env');
const { AppError } = require('../utils/AppError');
const { renderResumeHtml } = require('./pdfTemplateService');

function findBrowserExecutable() {
  if (env.PUPPETEER_EXECUTABLE_PATH) {
    if (!fs.existsSync(env.PUPPETEER_EXECUTABLE_PATH)) {
      throw new AppError('PUPPETEER_EXECUTABLE_PATH points to a browser that does not exist. Update backend/.env and restart the backend.', 503);
    }
    return env.PUPPETEER_EXECUTABLE_PATH;
  }

  const bundledPath = puppeteer.executablePath();
  if (fs.existsSync(bundledPath)) return bundledPath;

  const candidates = process.platform === 'win32'
    ? [
      path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe')
    ]
    : process.platform === 'darwin'
      ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
      : ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'];

  return candidates.find((candidate) => candidate && fs.existsSync(candidate));
}

async function generateResumePdf(resume, template) {
  const executablePath = findBrowserExecutable();
  if (!executablePath) {
    throw new AppError('No Chrome or Chromium browser was found for PDF export. Install Chrome or set PUPPETEER_EXECUTABLE_PATH in backend/.env, then restart the backend.', 503);
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(renderResumeHtml(resume, template), { waitUntil: 'networkidle0' });
    // Await before finally closes Chrome; returning the promise directly lets
    // the finally block terminate the browser while PDF generation is pending.
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    // Puppeteer returns Uint8Array. Express serializes a Uint8Array as JSON,
    // which yields a 200 response that Chrome cannot open as a PDF.
    return Buffer.from(pdf);
  } catch (error) {
    console.error('[PDF generation error]', { message: error.message, executablePath });
    throw new AppError('PDF creation failed while starting the browser or rendering the resume. Check the backend console for details.', 502);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.warn('[PDF browser cleanup error]', error.message);
      }
    }
  }
}

module.exports = { generateResumePdf, findBrowserExecutable };
