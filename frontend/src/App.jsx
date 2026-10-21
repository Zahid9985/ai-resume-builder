import { useState } from 'react';
import { ArrowUpRight, Clock3, FileText, LayoutDashboard, PenLine } from 'lucide-react';
import HomePage from './pages/HomePage.jsx';
import { emptyResume } from './data/emptyResume.js';
import applyWiseLogo from './applywise-logo.png';

const steps = [
  { id: 'upload', label: 'Upload', icon: FileText },
  { id: 'analysis', label: 'Analysis', icon: LayoutDashboard },
  { id: 'builder', label: 'Builder', icon: PenLine }
];

export default function App() {
  const [screen, setScreen] = useState('upload');
  const [workflow, setWorkflow] = useState({
    resumeText: '',
    originalFileName: '',
    jobDescription: '',
    analysis: null,
    analysisId: null,
    masterResumeId: null,
    generatedResume: emptyResume
  });

  const updateWorkflow = (patch) => setWorkflow((current) => ({ ...current, ...patch }));

  return (
    <div className="folio-shell min-h-screen">
      <header className="folio-header">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <a href="#" className="folio-brand" aria-label="ApplyWise home">
            <img src={applyWiseLogo} alt="" className="folio-brand-logo" />
            <span><span className="folio-brand-name">ApplyWise</span><span className="folio-brand-note">AI RESUME WORKSHOP</span></span>
          </a>
          <nav className="folio-nav" aria-label="Resume workflow">
            {steps.map((step) => {
              const Icon = step.icon;
              const active = screen === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setScreen(step.id)}
                  className={`folio-step ${
                    active ? 'folio-step-active' : ''
                  }`}
                >
                  <Icon size={15} strokeWidth={1.8} />
                  {step.label}
                </button>
              );
            })}
          </nav>
          <a className="folio-help" href="mailto:hello@folio.local">A better next step <ArrowUpRight size={15} /></a>
        </div>
      </header>

      {screen === 'upload' && (
        <HomePage workflow={workflow} updateWorkflow={updateWorkflow} onComplete={() => setScreen('analysis')} />
      )}
      {screen !== 'upload' && (
        <main className="folio-coming-soon mx-auto flex min-h-[65vh] max-w-4xl items-center justify-center px-5 py-12">
          <section className="folio-coming-card w-full max-w-2xl text-center" aria-labelledby="coming-soon-title">
            <span className="folio-coming-icon" aria-hidden="true"><Clock3 size={24} strokeWidth={1.7} /></span>
            <p className="folio-kicker justify-center"><span className="folio-kicker-dot" /> APPLYWISE WORKSHOP</p>
            <h1 id="coming-soon-title" className="folio-page-title mt-4">
              {screen === 'analysis' ? 'Analysis' : 'Resume Builder'} is coming soon.
            </h1>
            <p className="folio-page-subtitle mx-auto mt-4 max-w-lg">
              This page isn’t ready yet. We’re planning it for a future version of ApplyWise.
            </p>
            <button className="folio-coming-back mt-8" onClick={() => setScreen('upload')}>
              Back to Upload
            </button>
          </section>
        </main>
      )}
    </div>
  );
}
