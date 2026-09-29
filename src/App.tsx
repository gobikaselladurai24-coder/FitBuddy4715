import React, { useState } from 'react';
import { UserProfile, FitnessPlan } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PlanForm } from './components/PlanForm';
import { PlanView } from './components/PlanView';
import { ApiModal } from './components/ApiModal';
import { Dumbbell, Sparkles, CheckCircle2, ShieldAlert, Heart, Activity } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Kavin',
    age: 20,
    weight: 65,
    goal: 'Muscle Gain',
    intensity: 'Medium',
    experience: 'Beginner',
    preference: 'Home Workout',
    additionalNotes: 'Focus on progressive overload with bodyweight & dumbbells.',
  });

  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Generate 7-Day Plan
  const handleGeneratePlan = async (userProfile: UserProfile) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const data = await response.json();
      setPlan(data);
      setProfile(userProfile);

      // Smooth scroll to plan
      setTimeout(() => {
        const el = document.getElementById('generated-plan-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Error generating plan:', err);
      setErrorMessage('Could not generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate plan with feedback
  const handleRegeneratePlan = async (feedback: string) => {
    if (!plan) return;
    setIsRegenerating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/regenerate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan: plan,
          feedback: feedback,
        }),
      });

      if (!response.ok) {
        throw new Error(`Regeneration failed with status ${response.status}`);
      }

      const updated = await response.json();
      setPlan(updated);

      // Scroll to top of plan container
      setTimeout(() => {
        const el = document.getElementById('generated-plan-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Error regenerating plan:', err);
      setErrorMessage('Could not regenerate plan. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleScrollToForm = () => {
    const el = document.getElementById('plan-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickLoadDemo = (demoProfile: UserProfile) => {
    setProfile(demoProfile);
    handleGeneratePlan(demoProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <Header
        onCreatePlanClick={handleScrollToForm}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onCreatePlanClick={handleScrollToForm}
          onQuickLoadDemo={handleQuickLoadDemo}
        />

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Section */}
          <PlanForm
            initialProfile={profile}
            onSubmit={handleGeneratePlan}
            isLoading={isLoading}
          />

          {/* Plan View Section */}
          {plan && (
            <div id="generated-plan-container" className="pt-6">
              <PlanView
                plan={plan}
                onRegenerate={handleRegeneratePlan}
                isRegenerating={isRegenerating}
                onReset={handleScrollToForm}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
              <Dumbbell className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">FitBuddy</span>
            <span>— AI Fitness &amp; 7-Day Workout Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="/docs" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
              FastAPI Swagger Docs (/docs)
            </a>
            <span>•</span>
            <a href="/api/health" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
              /api/health
            </a>
            <span>•</span>
            <button onClick={() => setIsApiModalOpen(true)} className="hover:text-emerald-400 transition">
              API Explorer
            </button>
          </div>
        </div>
      </footer>

      {/* API Explorer Modal */}
      <ApiModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
    </div>
  );
}
