import React from 'react';
import { Sparkles, ArrowRight, Zap, Flame, ShieldCheck, HeartHandshake } from 'lucide-react';
import { UserProfile } from '../types';

interface HeroSectionProps {
  onCreatePlanClick: () => void;
  onQuickLoadDemo: (profile: UserProfile) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCreatePlanClick, onQuickLoadDemo }) => {
  const kavinProfile: UserProfile = {
    name: 'Kavin',
    age: 20,
    weight: 65,
    goal: 'Muscle Gain',
    intensity: 'Medium',
    experience: 'Beginner',
    preference: 'Home Workout',
    additionalNotes: 'Focus on progressive overload with bodyweight and dumbbells.',
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-b border-slate-800">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Strength & Conditioning</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
            Your Personalized <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              7-Day Fitness Blueprint
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            FitBuddy crafts an exact, day-by-day workout routine, cardio protocol, and nutrition guidance tailored
            to your experience, equipment, and goals. Powered by Gemini AI with live refinement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={onCreatePlanClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Create My Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onQuickLoadDemo(kavinProfile)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium text-sm flex items-center justify-center gap-2 transition"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Load Kavin&apos;s Profile (Demo)</span>
            </button>
          </div>

          {/* Quick Metrics & Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-semibold">Muscle & Cut</span>
              </div>
              <p className="text-xs text-slate-400">Targeted sets, reps, and rest intervals.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-teal-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold">Home or Gym</span>
              </div>
              <p className="text-xs text-slate-400">Calisthenics, dumbbells, or full gym equipment.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span className="text-xs font-semibold">Live Feedback</span>
              </div>
              <p className="text-xs text-slate-400">Add cardio or rest with 1-click regeneration.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold">FastAPI Ready</span>
              </div>
              <p className="text-xs text-slate-400">Swagger UI at /docs and health check.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
