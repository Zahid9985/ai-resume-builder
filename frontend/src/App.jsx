import { useState } from 'react';
import { FileText, LayoutDashboard, PenLine } from 'lucide-react';
import HomePage from './pages/HomePage.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';
import BuilderPage from './pages/BuilderPage.jsx';
import { emptyResume } from './data/emptyResume.js';

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
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-river">Resume Studio</p>
            <h1 className="text-xl font-bold text-ink">AI Resume Analyzer & Builder</h1>
          </div>
          <nav className="flex gap-2 overflow-x-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              const active = screen === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setScreen(step.id)}
                  className={`flex min-w-28 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    active ? 'border-ink bg-ink text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <Icon size={16} />
                  {step.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {screen === 'upload' && (
        <HomePage workflow={workflow} updateWorkflow={updateWorkflow} onComplete={() => setScreen('analysis')} />
      )}
      {screen === 'analysis' && (
        <AnalysisPage workflow={workflow} updateWorkflow={updateWorkflow} onBuild={() => setScreen('builder')} onBack={() => setScreen('upload')} />
      )}
      {screen === 'builder' && (
        <BuilderPage workflow={workflow} updateWorkflow={updateWorkflow} onBack={() => setScreen('analysis')} />
      )}
    </div>
  );
}
