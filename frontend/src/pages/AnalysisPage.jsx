import { useState } from 'react';
import { ArrowLeft, Loader2, Wand2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import MetricCard from '../components/MetricCard.jsx';
import Panel from '../components/Panel.jsx';
import TagList from '../components/TagList.jsx';
import { generateResume, getErrorMessage } from '../services/api.js';

function InsightBlock({ title, items, tone }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-black text-ink">{title}</h3>
      <TagList items={items} tone={tone} />
    </div>
  );
}

function BulletBlock({ title, items }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-black text-ink">{title}</h3>
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
      <main className="mx-auto max-w-4xl px-5 py-10">
        <Panel className="p-8 text-center">
          <h2 className="text-2xl font-black text-ink">No analysis yet</h2>
          <p className="mt-2 text-slate-600">Upload a resume and run the analysis first.</p>
          <Button className="mt-5" variant="secondary" onClick={onBack}><ArrowLeft size={18} /> Back to upload</Button>
        </Panel>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-river">AI analysis dashboard</p>
          <h2 className="mt-1 text-3xl font-black text-ink">{workflow.originalFileName || 'Resume'} vs target role</h2>
        </div>
        <Button variant="secondary" onClick={onBack}><ArrowLeft size={18} /> Upload</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Estimated match" value={`${analysis.matchScore}%`} detail="Not an official ATS score" />
        <MetricCard title="Matched keywords" value={analysis.matchedTechnicalSkills?.length || 0} detail="Skills Gemini found in both inputs" />
        <MetricCard title="Gaps" value={analysis.missingRequiredSkills?.length || 0} detail="Requirements to address honestly" />
      </div>

      <Panel className="mt-5 p-5">
        <p className="text-sm leading-6 text-slate-700">{analysis.scoreRationale}</p>
      </Panel>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
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

      <div className="mt-6 flex justify-end">
        <Button variant="accent" onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
          Generate Tailored Resume
        </Button>
      </div>
    </main>
  );
}
