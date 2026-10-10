const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeHtml, renderResumeHtml } = require('../src/services/pdfTemplateService');

test('escapeHtml sanitizes PDF template content', () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
});

test('renderResumeHtml includes core resume sections', () => {
  const html = renderResumeHtml({
    contact: { name: 'Ada Lovelace', email: 'ada@example.com', phone: '', location: '', links: [] },
    headline: 'Engineer',
    summary: 'Builds reliable systems.',
    skills: [{ category: 'Languages', items: ['JavaScript'] }],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    additionalSections: []
  });

  assert.match(html, /Ada Lovelace/);
  assert.match(html, /Professional Summary/);
  assert.match(html, /Technical Skills/);
});
