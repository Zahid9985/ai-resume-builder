import { useState } from 'react';
import { ArrowLeft, Wand2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import MetricCard from '../components/MetricCard.jsx';
import Panel from '../components/Panel.jsx';
import TagList from '../components/TagList.jsx';
import ResumeGenerateLoader from '../components/ResumeGenerateLoader.jsx';
import { generateResume, getErrorMessage } from '../services/api.js';

function InsightBlock({ title, items, tone }) {
  return (
    <div className="folio-insight rounded-lg border border-slate-200 p-5">
      <h3 className="folio-section-title mb-3 text-sm font-black text-ink">{title}</h3>
      <TagList items={items} tone={tone} />
    </div>
  );
}

function BulletBlock({ title, items }) {
  return (
    <div className="folio-insight rounded-lg border border-slate-200 p-5">
      <h3 className="folio-section-title mb-3 text-sm font-black text-ink">{title}</h3>
      <ul className="space-y-2 text-sm leading-6 text-slate-700">
        {(items || []).map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function AnalysisPage({ workflow, updateWorkflow, onBuild, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const analysis = workflow.analysis;

  async function handleGenerate() {
    setError('');
    setLoading(true);
    try {
      const data = await generateResume({
        resumeText: workflow.resumeText,
        jobDescription: workflow.jobDescription,
        analysis,
        masterResumeId: workflow.masterResumeId,
        analysisId: workflow.analysisId
      });
      updateWorkflow({ generatedResume: data.resume, generatedResumeId: data.generatedResumeId });
      onBuild();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!analysis) {
    return (
      <main className="folio-main mx-auto max-w-4xl px-5 py-10">
        <Panel className="p-8 text-center">
          <h2 className="text-2xl font-black text-ink">No analysis yet</h2>
          <p className="mt-2 text-slate-600">Upload a resume and run the analysis first.</p>
          <Button className="mt-5" variant="secondary" onClick={onBack}><ArrowLeft size={18} /> Back to upload</Button>
        </Panel>
      </main>
    );
  }

  return (
    <>
    {loading && <ResumeGenerateLoader />}
    <main className="folio-main folio-analysis mx-auto max-w-7xl px-5 py-8 lg:py-12">
      <div className="folio-page-heading mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="folio-kicker"><span className="folio-kicker-dot" /> ROLE FIT REVIEW <span className="folio-heading-step">02 / 03</span></p>
          <h2 className="folio-page-title mt-3">A closer look at the fit.</h2>
          <p className="folio-page-subtitle mt-2">{workflow.originalFileName || 'Your resume'} <span>·</span> Compared with your target role</p>
        </div>
        <Button variant="secondary" onClick={onBack}><ArrowLeft size={16} /> Edit materials</Button>
      </div>

      <div className="folio-scoreboard grid gap-4 lg:grid-cols-[1.15fr_.85fr_.85fr]">
        <div className="folio-score-feature">
          <div className="folio-score-copy"><p className="folio-score-label">ROLE ALIGNMENT</p><p className="folio-score-value">{analysis.matchScore}<span>%</span></p><p className="folio-score-note">A directional read, not an official ATS score.</p></div>
          <div className="folio-score-ring" style={{ '--score': `${Math.max(0, Math.min(100, Number(analysis.matchScore) || 0))}%` }}><span>{analysis.matchScore}<small>%</small></span></div>
        </div>
        <MetricCard title="Shared strengths" value={analysis.matchedTechnicalSkills?.length || 0} detail="Skills found in both" />
        <MetricCard title="Open questions" value={analysis.missingRequiredSkills?.length || 0} detail="Requirements to address honestly" />
      </div>

      <Panel className="folio-rationale mt-4 p-5 sm:p-6">
        <p className="folio-rationale-label">THE READ</p>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-700">{analysis.scoreRationale}</p>
      </Panel>

      <div className="folio-insight-grid mt-4 grid gap-4 lg:grid-cols-2">
        <InsightBlock title="Matched technical skills" items={analysis.matchedTechnicalSkills} tone="good" />
        <InsightBlock title="Missing required skills" items={analysis.missingRequiredSkills} tone="warn" />
        <BulletBlock title="Relevant experience" items={analysis.relevantWorkExperience} />
        <BulletBlock title="Missing job requirements" items={analysis.missingJobRequirements} />
        <BulletBlock title="Strengths" items={analysis.strengths} />
        <BulletBlock title="Weaknesses" items={analysis.weaknesses} />
        <BulletBlock title="ATS recommendations" items={analysis.atsRecommendations} />
        <BulletBlock title="Improvement suggestions" items={analysis.improvementSuggestions} />
      </div>

      {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

      <div className="folio-analysis-footer mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>Next: shape a tailored draft, then make it yours.</p>
        <Button variant="accent" onClick={handleGenerate} disabled={loading}>
          <Wand2 size={18} />
          {loading ? 'Generating Resume…' : 'Generate Tailored Resume'}
        </Button>
      </div>
    </main>
    </>
  );
}
