function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function linkHtml(link) {
  const label = escapeHtml(link.label || link.url);
  const url = escapeHtml(link.url || '');
  if (!url) return '';
  return `<a href="${url}">${label}</a>`;
}

function list(items) {
  if (!items?.length) return '';
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function section(title, body) {
  if (!body) return '';
  return `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function renderResumeHtml(resume, template = 'classic') {
  const accent = template === 'modern' ? '#0f766e' : template === 'compact' ? '#334155' : '#1d4ed8';
  const density = template === 'compact' ? '10px' : '14px';
  const links = resume.contact.links?.map(linkHtml).filter(Boolean).join(' | ');
  const contactLine = [
    resume.contact.email ? `<a href="mailto:${escapeHtml(resume.contact.email)}">${escapeHtml(resume.contact.email)}</a>` : '',
    escapeHtml(resume.contact.phone),
    escapeHtml(resume.contact.location),
    links
  ].filter(Boolean).join(' | ');

  const skills = resume.skills?.map((group) => (
    `<p><strong>${escapeHtml(group.category)}:</strong> ${escapeHtml(group.items.join(', '))}</p>`
  )).join('');

  const experience = resume.experience?.map((job) => `
    <div class="entry">
      <div class="row"><strong>${escapeHtml(job.role)}</strong><span>${escapeHtml([job.startDate, job.endDate].filter(Boolean).join(' - '))}</span></div>
      <div class="muted">${escapeHtml([job.company, job.location].filter(Boolean).join(' | '))}</div>
      ${list(job.bullets)}
    </div>
  `).join('');

  const projects = resume.projects?.map((project) => `
    <div class="entry">
      <strong>${escapeHtml(project.name)}</strong>
      ${project.description ? `<p>${escapeHtml(project.description)}</p>` : ''}
      ${project.technologies?.length ? `<p class="muted">${escapeHtml(project.technologies.join(', '))}</p>` : ''}
      ${list(project.bullets)}
    </div>
  `).join('');

  const education = resume.education?.map((item) => `
    <div class="entry">
      <div class="row"><strong>${escapeHtml(item.degree)}</strong><span>${escapeHtml(item.dates)}</span></div>
      <div class="muted">${escapeHtml([item.institution, item.location].filter(Boolean).join(' | '))}</div>
    </div>
  `).join('');

  const additional = resume.additionalSections?.map((item) => section(item.title, list(item.items))).join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    body { color: #111827; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.45; margin: 0; }
    header { border-bottom: 2px solid ${accent}; padding-bottom: 10px; margin-bottom: ${density}; }
    h1 { font-size: 25px; margin: 0 0 3px; letter-spacing: 0; }
    .headline { color: ${accent}; font-size: 12px; font-weight: 700; margin-bottom: 5px; }
    .contact, .muted { color: #4b5563; }
    h2 { color: ${accent}; font-size: 12px; margin: ${density} 0 6px; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 3px; letter-spacing: 0; }
    p { margin: 0 0 6px; }
    ul { margin: 4px 0 0 16px; padding: 0; }
    li { margin-bottom: 3px; break-inside: avoid; }
    a { color: #1d4ed8; text-decoration: none; }
    section, .entry { break-inside: avoid; }
    .entry { margin-bottom: 8px; }
    .row { align-items: baseline; display: flex; justify-content: space-between; gap: 16px; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(resume.contact.name)}</h1>
    ${resume.headline ? `<div class="headline">${escapeHtml(resume.headline)}</div>` : ''}
    <div class="contact">${contactLine}</div>
  </header>
  ${section('Professional Summary', resume.summary ? `<p>${escapeHtml(resume.summary)}</p>` : '')}
  ${section('Technical Skills', skills)}
  ${section('Experience', experience)}
  ${section('Projects', projects)}
  ${section('Education', education)}
  ${section('Certifications', list(resume.certifications))}
  ${additional || ''}
</body>
</html>`;
}

module.exports = { renderResumeHtml, escapeHtml };
