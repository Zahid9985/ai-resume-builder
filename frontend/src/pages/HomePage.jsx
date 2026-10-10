import { useRef, useState } from 'react';
import { FileUp, Loader2, ScanSearch } from 'lucide-react';
import Button from '../components/Button.jsx';
import Panel from '../components/Panel.jsx';
import { analyzeResume, getErrorMessage, uploadResume } from '../services/api.js';

export default function HomePage({ workflow, updateWorkflow, onComplete }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState(workflow.originalFileName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const uploaded = await uploadResume(file);
      setFileName(uploaded.originalFileName);
      updateWorkflow({
        resumeText: uploaded.resumeText,
        originalFileName: uploaded.originalFileName,
        masterResumeId: uploaded.masterResumeId
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    setError('');
    setLoading(true);
    try {
      const data = await analyzeResume({
        resumeText: workflow.resumeText,
        jobDescription: workflow.jobDescription,
        masterResumeId: workflow.masterResumeId
      });
      updateWorkflow({ analysis: data.analysis, analysisId: data.analysisId });
      onComplete();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex flex-col justify-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-river">Targeted resume workflow</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-ink sm:text-5xl">
          Analyze the gap. Build the version that fits the role.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
          Upload a resume, paste the job description, and generate a factual ATS-friendly draft that you can refine before exporting.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {['PDF/DOCX parsing', 'Skill-gap analysis', 'Editable PDF export'].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <Panel className="p-5">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleFile(event.dataTransfer.files?.[0]);
          }}
          className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-fog/70 p-6 text-center transition hover:border-river"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            className="hidden"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <FileUp className="text-river" size={42} />
          <p className="mt-4 text-lg font-black text-ink">{fileName || 'Drop your resume here'}</p>
          <p className="mt-2 text-sm text-slate-600">PDF or DOCX, up to the backend configured file limit.</p>
        </div>

        <label className="mt-5 block text-sm font-bold text-ink" htmlFor="job-description">
          Target job description
        </label>
        <textarea
          id="job-description"
          value={workflow.jobDescription}
          onChange={(event) => updateWorkflow({ jobDescription: event.target.value })}
          rows={11}
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-800 focus:border-river focus:ring-2 focus:ring-river/20"
          placeholder="Paste the full role description, required skills, responsibilities, and preferred qualifications."
        />

        {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

        <Button onClick={handleAnalyze} disabled={loading || !workflow.resumeText || !workflow.jobDescription} className="mt-5 w-full">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <ScanSearch size={18} />}
          Analyze Resume
        </Button>
      </Panel>
    </main>
  );
}
