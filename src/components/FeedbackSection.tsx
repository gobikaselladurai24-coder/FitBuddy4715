import React, { useState } from 'react';
import { RefreshCw, MessageSquare, Sparkles, CheckCircle2, History, ArrowRight } from 'lucide-react';
import { FeedbackRecord } from '../types';

interface FeedbackSectionProps {
  onRegenerate: (feedback: string) => void;
  isLoading: boolean;
  history?: FeedbackRecord[];
  currentVersion: number;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  onRegenerate,
  isLoading,
  history = [],
  currentVersion,
}) => {
  const [feedbackText, setFeedbackText] = useState('Add more cardio and include more recovery.');

  const promptSuggestions = [
    'Add more cardio and include more recovery.',
    'Focus more on chest, arms and core definition.',
    'Make workouts shorter (under 35 mins each).',
    'Include more dynamic stretching and mobility.',
    'Swap to dumbbell-only exercises where possible.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || isLoading) return;
    onRegenerate(feedbackText.trim());
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-white mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">Refine Your Plan with AI Feedback</h3>
          </div>
          <p className="text-sm text-slate-400">
            Need adjustments? Tell the AI to tweak cardio, recovery days, volume, or muscle focus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
            Plan Version {currentVersion}
          </span>
        </div>
      </div>

      {/* Suggested Feedback Chips */}
      <div className="mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Suggested Refinements:
        </span>
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setFeedbackText(suggestion)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition text-left flex items-center gap-1.5 ${
                feedbackText === suggestion
                  ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="e.g. Add more cardio and include more recovery."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AI preserves your schedule while dynamically recalibrating the routines.</span>
          </p>

          <button
            type="submit"
            disabled={isLoading || !feedbackText.trim()}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 text-slate-950 transition shadow-lg ${
              isLoading || !feedbackText.trim()
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-teal-500/20 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Updating Routine...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-slate-950" />
                <span>Regenerate Plan</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* History of changes if any */}
      {history.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <History className="w-3.5 h-3.5 text-teal-400" />
            <span>Applied Feedback Iterations</span>
          </div>

          <div className="space-y-2.5">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="font-semibold text-white">&ldquo;{item.feedback}&rdquo;</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-400 pl-4 border-l border-slate-700/60 ml-1">
                  {item.summaryOfChanges}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
