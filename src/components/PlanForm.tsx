import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Dumbbell, User, Calendar, Weight, Target, Activity, Award, Home, Sparkles, Check } from 'lucide-react';

interface PlanFormProps {
  initialProfile?: UserProfile;
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const PlanForm: React.FC<PlanFormProps> = ({ initialProfile, onSubmit, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      name: 'Kavin',
      age: 20,
      weight: 65,
      goal: 'Muscle Gain',
      intensity: 'Medium',
      experience: 'Beginner',
      preference: 'Home Workout',
      additionalNotes: '',
    }
  );

  const goals = ['Muscle Gain', 'Fat Loss', 'Endurance', 'Strength & Power', 'General Fitness'];
  const intensities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const experiences: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const preferences: ('Home Workout' | 'Gym Workout' | 'Calisthenics' | 'Minimal Equipment')[] = [
    'Home Workout',
    'Gym Workout',
    'Calisthenics',
    'Minimal Equipment',
  ];

  const handleFillKavin = () => {
    setProfile({
      name: 'Kavin',
      age: 20,
      weight: 65,
      goal: 'Muscle Gain',
      intensity: 'Medium',
      experience: 'Beginner',
      preference: 'Home Workout',
      additionalNotes: 'Focus on progressive overload with bodyweight & dumbbells.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) return;
    onSubmit(profile);
  };

  return (
    <div id="plan-form-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Your Fitness Profile</h2>
          </div>
          <p className="text-sm text-slate-400">
            Tell us about your body, goals, and training preferences to generate your custom 7-day schedule.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillKavin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 border border-emerald-500/30 transition shrink-0 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fill Test Profile (Kavin)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Inputs: Name, Age, Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g. Kavin"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Age (Years)</span>
            </label>
            <input
              type="number"
              required
              min={12}
              max={100}
              value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value, 10) || 0 })}
              placeholder="e.g. 20"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Weight className="w-3.5 h-3.5 text-cyan-400" />
              <span>Weight (kg)</span>
            </label>
            <input
              type="number"
              required
              min={30}
              max={250}
              value={profile.weight || ''}
              onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 65"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Primary Goal */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Primary Fitness Goal</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {goals.map((g) => {
              const selected = profile.goal === g;
              return (
                <button
                  type="button"
                  key={g}
                  onClick={() => setProfile({ ...profile, goal: g })}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition text-center flex items-center justify-center gap-1.5 ${
                    selected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{g}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensity and Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Intensity */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Workout Intensity</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {intensities.map((lvl) => {
                const selected = profile.intensity === lvl;
                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setProfile({ ...profile, intensity: lvl })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition text-center ${
                      selected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Experience Level</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {experiences.map((exp) => {
                const selected = profile.experience === exp;
                return (
                  <button
                    type="button"
                    key={exp}
                    onClick={() => setProfile({ ...profile, experience: exp })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition text-center ${
                      selected
                        ? 'bg-blue-500 text-slate-950 border-blue-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {exp}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workout Preference */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-teal-400" />
            <span>Workout Environment / Equipment</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {preferences.map((pref) => {
              const selected = profile.preference === pref;
              return (
                <button
                  type="button"
                  key={pref}
                  onClick={() => setProfile({ ...profile, preference: pref })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition text-center flex items-center justify-center gap-1.5 ${
                    selected
                      ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{pref}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 text-slate-950 transition shadow-lg ${
              isLoading
                ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 shadow-emerald-500/25 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Gemini AI is crafting your 7-day routine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate My 7-Day Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
