import { useState } from 'react';
import { ArrowLeft, Download, Plus, Trash2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import Panel from '../components/Panel.jsx';
import ResumePreview from '../components/ResumePreview.jsx';
import { addArrayItem, removeArrayItem, updateAtPath } from '../utils/resumeMutators.js';
import { downloadPdf, getErrorMessage } from '../services/api.js';

const templates = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'compact', label: 'Compact' }
];

export default function BuilderPage({ workflow, updateWorkflow, onBack }) {
  const [template, setTemplate] = useState('classic');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const resume = workflow.generatedResume;

  const setResume = (next) => updateWorkflow({ generatedResume: next });
  const setField = (path, value) => setResume(updateAtPath(resume, path, value));

  async function handleDownload() {
    setError('');
    setLoading(true);
    try {
      await downloadPdf({ resume, template });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="folio-main folio-builder mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:py-12 xl:grid-cols-[0.88fr_1.12fr]">
      <section>
        <div className="folio-page-heading mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="folio-kicker"><span className="folio-kicker-dot" /> YOUR EDIT DESK <span className="folio-heading-step">03 / 03</span></p>
            <h2 className="folio-page-title mt-3">Make the draft yours.</h2>
            <p className="folio-page-subtitle mt-2">Review every detail before it leaves your desk.</p>
          </div>
          <Button variant="secondary" onClick={onBack}><ArrowLeft size={16} /> Review fit</Button>
        </div>

        <Panel className="folio-editor-panel p-5 sm:p-6">
          <div className="folio-editor-topline"><span>RESUME DETAILS</span><span>EDITABLE DRAFT</span></div>
          <div className="folio-template-picker mb-6 grid grid-cols-3 gap-2">
            {templates.map((item) => (
              <button
                key={item.id}
                onClick={() => setTemplate(item.id)}
                className={`folio-template-option rounded-md border px-3 py-2 text-sm font-bold ${template === item.id ? 'folio-template-selected border-ink bg-ink text-white' : 'border-slate-300 bg-white text-slate-700'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <TextInput label="Name" value={resume.contact.name} onChange={(value) => setField(['contact', 'name'], value)} />
          <TextInput label="Headline" value={resume.headline} onChange={(value) => setField(['headline'], value)} />
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput label="Email" value={resume.contact.email} onChange={(value) => setField(['contact', 'email'], value)} />
            <TextInput label="Phone" value={resume.contact.phone} onChange={(value) => setField(['contact', 'phone'], value)} />
            <TextInput label="Location" value={resume.contact.location} onChange={(value) => setField(['contact', 'location'], value)} />
          </div>
          <TextArea label="Summary" value={resume.summary} onChange={(value) => setField(['summary'], value)} rows={4} />

          <EditableSkills resume={resume} setResume={setResume} />
          <EditableExperience resume={resume} setResume={setResume} />
          <EditableProjects resume={resume} setResume={setResume} />
          <EditableEducation resume={resume} setResume={setResume} />

          {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
          <Button onClick={handleDownload} disabled={loading} className="mt-5 w-full">
            <Download size={18} />
            {loading ? 'Preparing PDF...' : 'Download PDF'}
          </Button>
        </Panel>
      </section>

      <section className="folio-preview-column xl:sticky xl:top-5 xl:self-start">
        <div className="folio-preview-heading"><div><p>LIVE PREVIEW</p><span>Updates as you edit</span></div><span className="folio-preview-size">A4</span></div>
        <ResumePreview resume={resume} template={template} />
      </section>
    </main>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="mb-3 block text-sm font-bold text-ink">
      {label}
      <input
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal focus:border-river focus:ring-2 focus:ring-river/20"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="mb-3 block text-sm font-bold text-ink">
      {label}
      <textarea
        rows={rows}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal leading-6 focus:border-river focus:ring-2 focus:ring-river/20"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SectionEditor({ title, onAdd, children }) {
  return (
    <div className="mt-5 border-t border-slate-200 pt-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-black text-ink">{title}</h3>
        <Button type="button" variant="secondary" onClick={onAdd} className="px-3 py-2"><Plus size={16} /> Add</Button>
      </div>
      {children}
    </div>
  );
}

function EditableSkills({ resume, setResume }) {
  return (
    <SectionEditor
      title="Skills"
      onAdd={() => setResume(addArrayItem(resume, ['skills'], { category: 'Skills', items: [] }))}
    >
      {resume.skills.map((group, index) => (
        <div key={index} className="mb-3 rounded-lg border border-slate-200 p-3">
          <TextInput label="Category" value={group.category} onChange={(value) => setResume(updateAtPath(resume, ['skills', index, 'category'], value))} />
          <TextArea label="Items, comma separated" value={group.items.join(', ')} onChange={(value) => setResume(updateAtPath(resume, ['skills', index, 'items'], value.split(',').map((item) => item.trim()).filter(Boolean)))} />
          <RemoveButton onClick={() => setResume(removeArrayItem(resume, ['skills'], index))} />
        </div>
      ))}
    </SectionEditor>
  );
}

function EditableExperience({ resume, setResume }) {
  return (
    <SectionEditor
      title="Experience"
      onAdd={() => setResume(addArrayItem(resume, ['experience'], { company: '', role: '', location: '', startDate: '', endDate: '', bullets: [] }))}
    >
      {resume.experience.map((job, index) => (
        <div key={index} className="mb-3 rounded-lg border border-slate-200 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Role" value={job.role} onChange={(value) => setResume(updateAtPath(resume, ['experience', index, 'role'], value))} />
            <TextInput label="Company" value={job.company} onChange={(value) => setResume(updateAtPath(resume, ['experience', index, 'company'], value))} />
            <TextInput label="Start" value={job.startDate} onChange={(value) => setResume(updateAtPath(resume, ['experience', index, 'startDate'], value))} />
            <TextInput label="End" value={job.endDate} onChange={(value) => setResume(updateAtPath(resume, ['experience', index, 'endDate'], value))} />
          </div>
          <TextArea label="Bullets, one per line" value={job.bullets.join('\n')} onChange={(value) => setResume(updateAtPath(resume, ['experience', index, 'bullets'], value.split('\n').filter(Boolean)))} />
          <RemoveButton onClick={() => setResume(removeArrayItem(resume, ['experience'], index))} />
        </div>
      ))}
    </SectionEditor>
  );
}

function EditableProjects({ resume, setResume }) {
  return (
    <SectionEditor
      title="Projects"
      onAdd={() => setResume(addArrayItem(resume, ['projects'], { name: '', description: '', technologies: [], bullets: [] }))}
    >
      {resume.projects.map((project, index) => (
        <div key={index} className="mb-3 rounded-lg border border-slate-200 p-3">
          <TextInput label="Name" value={project.name} onChange={(value) => setResume(updateAtPath(resume, ['projects', index, 'name'], value))} />
          <TextArea label="Description" value={project.description} onChange={(value) => setResume(updateAtPath(resume, ['projects', index, 'description'], value))} />
          <TextArea label="Bullets, one per line" value={project.bullets.join('\n')} onChange={(value) => setResume(updateAtPath(resume, ['projects', index, 'bullets'], value.split('\n').filter(Boolean)))} />
          <RemoveButton onClick={() => setResume(removeArrayItem(resume, ['projects'], index))} />
        </div>
      ))}
    </SectionEditor>
  );
}

function EditableEducation({ resume, setResume }) {
  return (
    <SectionEditor
      title="Education"
      onAdd={() => setResume(addArrayItem(resume, ['education'], { institution: '', degree: '', location: '', dates: '' }))}
    >
      {resume.education.map((item, index) => (
        <div key={index} className="mb-3 rounded-lg border border-slate-200 p-3">
          <TextInput label="Degree" value={item.degree} onChange={(value) => setResume(updateAtPath(resume, ['education', index, 'degree'], value))} />
          <TextInput label="Institution" value={item.institution} onChange={(value) => setResume(updateAtPath(resume, ['education', index, 'institution'], value))} />
          <TextInput label="Dates" value={item.dates} onChange={(value) => setResume(updateAtPath(resume, ['education', index, 'dates'], value))} />
          <RemoveButton onClick={() => setResume(removeArrayItem(resume, ['education'], index))} />
        </div>
      ))}
    </SectionEditor>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button type="button" className="inline-flex items-center gap-2 rounded-md text-sm font-bold text-red-700" onClick={onClick}>
      <Trash2 size={15} /> Remove
    </button>
  );
}
