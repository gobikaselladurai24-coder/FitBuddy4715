import React, { useState } from 'react';
import { X, Activity, FileText, CheckCircle2, Copy, Play, ExternalLink } from 'lucide-react';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiModal: React.FC<ApiModalProps> = ({ isOpen, onClose }) => {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [testingHealth, setTestingHealth] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const testHealthEndpoint = async () => {
    setTestingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setHealthStatus(`Error: ${err.message}`);
    } finally {
      setTestingHealth(false);
    }
  };

  const copyCurl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">FitBuddy API & Swagger Explorer</h3>
            <p className="text-xs text-slate-400">RESTful FastAPI-compatible endpoints powering the application</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition group flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-1">
                <FileText className="w-4 h-4" />
                <span>Swagger UI Documentation</span>
              </div>
              <p className="text-xs text-slate-400">Interactive OpenAPI specification at /docs</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
          </a>

          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 transition group flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-sm font-bold mb-1">
                <Activity className="w-4 h-4" />
                <span>Raw /api/health Endpoint</span>
              </div>
              <p className="text-xs text-slate-400">Check server alive status directly in browser</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition" />
          </a>
        </div>

        {/* Live Test: /api/health */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                GET
              </span>
              <span className="font-mono text-xs text-slate-200">/api/health</span>
            </div>

            <button
              onClick={testHealthEndpoint}
              disabled={testingHealth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition active:scale-95"
            >
              <Play className="w-3 h-3 fill-slate-950" />
              <span>{testingHealth ? 'Testing...' : 'Execute Test'}</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs">
            <div className="text-slate-500 mb-1">// Expected Response: &#123; &quot;status&quot;: &quot;ok&quot; &#125;</div>
            <pre className="text-emerald-400 whitespace-pre-wrap">
              {healthStatus || '{ "status": "ok" }'}
            </pre>
          </div>
        </div>

        {/* POST /api/generate-plan curl sample */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">
                POST
              </span>
              <span className="font-mono text-xs text-slate-200">/api/generate-plan</span>
            </div>

            <button
              onClick={() => copyCurl(`curl -X POST http://localhost:3000/api/generate-plan -H "Content-Type: application/json" -d '{"name":"Kavin","age":20,"weight":65,"goal":"Muscle Gain","intensity":"Medium","experience":"Beginner","preference":"Home Workout"}'`)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 p-3 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto">
{`curl -X POST /api/generate-plan \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Kavin",
    "age": 20,
    "weight": 65,
    "goal": "Muscle Gain",
    "intensity": "Medium",
    "experience": "Beginner",
    "preference": "Home Workout"
  }'`}
          </pre>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
