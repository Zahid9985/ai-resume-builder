export default function ResumePreview({ resume, template }) {
  const accent = template === 'modern' ? 'text-teal-700 border-teal-700' : template === 'compact' ? 'text-slate-700 border-slate-500' : 'text-blue-700 border-blue-700';
  return (
    <article className="a4-preview mx-auto w-full max-w-[760px] overflow-hidden p-8 text-[10px] leading-normal text-slate-900 sm:text-xs">
      <header className={`border-b-2 pb-3 ${accent}`}>
        <h1 className="text-2xl font-black text-slate-950">{resume.contact.name || 'Your Name'}</h1>
        <p className="font-bold">{resume.headline}</p>
        <p className="mt-1 text-slate-600">
          {[resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(' | ')}
        </p>
      </header>
      <PreviewSection title="Professional Summary" accent={accent}>
        <p>{resume.summary}</p>
      </PreviewSection>
      <PreviewSection title="Technical Skills" accent={accent}>
        {resume.skills.map((group, index) => (
          <p key={`${group.category}-${index}`}><strong>{group.category}:</strong> {group.items.join(', ')}</p>
        ))}
      </PreviewSection>
      <PreviewSection title="Experience" accent={accent}>
        {resume.experience.map((job, index) => (
          <div key={`${job.company}-${index}`} className="mb-2">
            <div className="flex justify-between gap-4 font-bold"><span>{job.role}</span><span>{[job.startDate, job.endDate].filter(Boolean).join(' - ')}</span></div>
            <p className="text-slate-600">{[job.company, job.location].filter(Boolean).join(' | ')}</p>
            <ul className="ml-4 list-disc">{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </div>
        ))}
      </PreviewSection>
      <PreviewSection title="Projects" accent={accent}>
        {resume.projects.map((project, index) => (
          <div key={`${project.name}-${index}`} className="mb-2">
            <p className="font-bold">{project.name}</p>
            <p>{project.description}</p>
            <p className="text-slate-600">{project.technologies.join(', ')}</p>
            <ul className="ml-4 list-disc">{project.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </div>
        ))}
      </PreviewSection>
      <PreviewSection title="Education" accent={accent}>
        {resume.education.map((item, index) => (
          <div key={`${item.institution}-${index}`} className="mb-1">
            <div className="flex justify-between gap-4 font-bold"><span>{item.degree}</span><span>{item.dates}</span></div>
            <p className="text-slate-600">{[item.institution, item.location].filter(Boolean).join(' | ')}</p>
          </div>
        ))}
      </PreviewSection>
    </article>
  );
}

function PreviewSection({ title, accent, children }) {
  return (
    <section className="mt-3">
      <h2 className={`mb-1 border-b text-[11px] font-black uppercase ${accent}`}>{title}</h2>
      {children}
    </section>
  );
}
