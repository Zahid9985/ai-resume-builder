import { useRef, useState } from 'react';
import { ArrowDown, Check, FileUp, Loader2, ScanSearch } from 'lucide-react';
import Button from '../components/Button.jsx';
import Panel from '../components/Panel.jsx';
import ResumeUploadLoader from '../components/ResumeUploadLoader.jsx';
import { analyzeResume, getErrorMessage, uploadResume } from '../services/api.js';

export default function HomePage({ workflow, updateWorkflow, onComplete }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState(workflow.originalFileName);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file || uploading) return;
    setError('');
    const startedAt = Date.now();
    setUploading(true);
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
      const visibleFor = Date.now() - startedAt;
      if (visibleFor < 4000) await new Promise((resolve) => window.setTimeout(resolve, 4000 - visibleFor));
      setUploading(false);
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
    <>
    {uploading && <ResumeUploadLoader />}
    <main className="folio-main mx-auto grid max-w-7xl gap-12 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
      <section className="folio-intro flex flex-col justify-center">
        <p className="folio-kicker"><span className="folio-kicker-dot" /> YOUR NEXT CHAPTER, WELL EDITED</p>
        <h2 className="folio-display mt-5 max-w-2xl">
          Make your experience <em>impossible</em> to overlook.
        </h2>
        <p className="folio-lede mt-5 max-w-xl">
          A thoughtful read of your resume against the role, then a sharper draft that still sounds like you.
        </p>
        <div className="folio-promises mt-8">
          {['Your facts stay yours', 'Built around the role', 'Ready for a final edit'].map((item) => (
            <div key={item} className="folio-promise">
              <Check size={15} /> {item}
            </div>
          ))}
        </div>
        <div className="folio-footnote mt-10"><span>01 / 03</span><span>Start with the material you have</span><ArrowDown size={15} /></div>
      </section>

      <Panel className="folio-form p-5 sm:p-7">
        <div className="folio-form-heading mb-5">
          <div><p className="folio-form-index">THE WORKSHOP <span>·</span> STEP 01</p><h3>Bring us the brief.</h3></div>
          <span className="folio-form-number">01</span>
        </div>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (uploading) return;
            handleFile(event.dataTransfer.files?.[0]);
          }}
          className="folio-dropzone flex min-h-48 cursor-pointer flex-col items-center justify-center p-6 text-center transition"
          onClick={() => !uploading && fileRef.current?.click()}
          aria-busy={uploading}
        >
          <input
            ref={fileRef}
            className="hidden"
            type="file"
            disabled={uploading}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <span className="folio-upload-icon"><FileUp size={21} strokeWidth={1.7} /></span>
          <p className="mt-3 text-base font-bold text-ink">{fileName || 'Drop your resume here'}</p>
          <p className="mt-1 text-xs text-slate-500">or browse files <span className="folio-filetype">PDF · DOCX</span></p>
        </div>

        <label className="folio-label mt-6 block text-sm font-bold text-ink" htmlFor="job-description">
          <span>02</span> The role you have in mind
        </label>
        <textarea
          id="job-description"
          value={workflow.jobDescription}
          onChange={(event) => updateWorkflow({ jobDescription: event.target.value })}
          rows={11}
          className="folio-textarea mt-2 w-full resize-y p-4 text-sm leading-6 text-slate-800 focus:border-river focus:ring-2 focus:ring-river/20"
          placeholder="Paste the job description here. The details help us find the right emphasis."
        />

        {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

        <Button onClick={handleAnalyze} disabled={loading || !workflow.resumeText || !workflow.jobDescription} className="mt-5 w-full">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <ScanSearch size={18} />}
          Analyze Resume
        </Button>
      </Panel>
    </main>
    </>
  );
}
