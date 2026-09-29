import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onCreatePlanClick: () => void;
  onOpenApiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreatePlanClick, onOpenApiModal }) => {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setApiOnline(data.status === 'ok');
      } else {
        setApiOnline(false);
      }
    } catch {
      setApiOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
            <Dumbbell className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                FitBuddy
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI Coach
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">7-Day Personalized Training Plans</p>
          </div>
        </div>

        {/* Navigation & Status */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Health Badge */}
          <div
            onClick={onOpenApiModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 hover:border-emerald-500/50 hover:bg-slate-800 cursor-pointer transition"
            title="Click to view API health details"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiOnline === true ? 'bg-emerald-400 animate-pulse' : apiOnline === false ? 'bg-amber-400' : 'bg-slate-400'
              }`}
            />
            <span className="font-mono text-[11px] hidden sm:inline">
              /api/health: {apiOnline ? '200 OK' : 'Checking...'}
            </span>
            <Activity className="w-3.5 h-3.5 text-slate-400 sm:hidden" />
          </div>

          {/* Swagger Docs Link */}
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
            title="Open FastAPI Swagger UI"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Swagger Docs</span>
            <span className="md:hidden">/docs</span>
          </a>

          {/* Create Plan Button */}
          <button
            onClick={onCreatePlanClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
