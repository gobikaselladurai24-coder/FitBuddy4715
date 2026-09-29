import React, { useState } from 'react';
import { FitnessPlan, DayPlan, Exercise } from '../types';
import {
  Calendar,
  Flame,
  Dumbbell,
  Heart,
  Droplets,
  Apple,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Info,
  Copy,
  Printer,
  ChevronRight,
  Shield,
  Activity,
  Bed,
  Check,
} from 'lucide-react';
import { FeedbackSection } from './FeedbackSection';

interface PlanViewProps {
  plan: FitnessPlan;
  onRegenerate: (feedback: string) => void;
  isRegenerating: boolean;
  onReset: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  onRegenerate,
  isRegenerating,
  onReset,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const currentDay: DayPlan = plan.days[selectedDayIndex] || plan.days[0];

  const toggleExercise = (exerciseId: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleCopyPlan = () => {
    const text = `FitBuddy 7-Day Plan for ${plan.user.name} (${plan.user.goal})\n\n` +
      plan.days.map(d => `${d.dayName} (${d.focus})\n` +
        d.exercises.map(e => ` - ${e.name}: ${e.sets} sets x ${e.reps} (Rest: ${e.rest})`).join('\n') +
        `\nCardio: ${d.cardio}\nCooldown: ${d.cooldown}\n`
      ).join('\n---\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate day completion percentage
  const dayExerciseCount = currentDay.exercises.length;
  const completedInDay = currentDay.exercises.filter((e) => completedExercises[e.id]).length;
  const dayProgressPercent = dayExerciseCount > 0 ? Math.round((completedInDay / dayExerciseCount) * 100) : 100;

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Top Banner / Plan Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan Version {plan.version}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                {plan.user.name}, {plan.user.age} yrs
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                {plan.user.weight} kg
              </span>

              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-medium">
                {plan.user.preference}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              {plan.title}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {plan.overview}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyPlan}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition active:scale-95"
            >
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* Nutritional & Weekly Target Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Daily Calories</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {plan.weeklyTargetCalories.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Optimized for {plan.user.goal.toLowerCase()}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Dumbbell className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Daily Protein</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {plan.targetProteinGrams} <span className="text-xs font-normal text-slate-400">g / day</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">~{((plan.targetProteinGrams / plan.user.weight) || 2).toFixed(1)}g per kg body weight</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <Heart className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Weekly Cardio</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {plan.cardioMinutesWeekly} <span className="text-xs font-normal text-slate-400">mins</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Heart rate & endurance target</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Bed className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Recovery Days</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {plan.recoveryDaysCount} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Tissue repair & CNS reset</p>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs (Day 1 - Day 7) */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              7-Day Training Schedule
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Select a day to view exercises & guide
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {plan.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const completedCount = day.exercises.filter((e) => completedExercises[e.id]).length;
            const isAllCompleted = day.exercises.length > 0 && completedCount === day.exercises.length;

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-400 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">
                      Day {day.dayNumber}
                    </span>
                    {day.isRestDay ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                        Recovery
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                        Workout
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                    {day.focus}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{day.exercises.length} movements</span>
                  {isAllCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : completedCount > 0 ? (
                    <span className="text-emerald-400 font-mono">{completedCount}/{day.exercises.length}</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Routine Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Day Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Day {currentDay.dayNumber} of 7</span>
              <span>•</span>
              <span className={currentDay.isRestDay ? 'text-cyan-400' : 'text-emerald-400'}>
                {currentDay.isRestDay ? 'Active Rest & Recovery Protocol' : 'Targeted Resistance Session'}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              {currentDay.dayName}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Focus: <span className="font-semibold text-white">{currentDay.focus}</span>
            </p>
          </div>

          {/* Progress Tracker for this Day */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 sm:w-64">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span className="font-semibold">Today&apos;s Workout Progress</span>
              <span className="font-mono text-emerald-400">{dayProgressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                style={{ width: `${dayProgressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 text-right">
              {completedInDay} of {dayExerciseCount} exercises completed
            </p>
          </div>
        </div>

        {/* Warmup Routine */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            <span>Pre-Workout Warm-Up Routine (5-8 Mins)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentDay.warmup}
          </p>
        </div>

        {/* Exercises List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Exercise Protocols ({currentDay.exercises.length})
              </h4>
            </div>
            <span className="text-xs text-slate-400">Click circle to mark completed</span>
          </div>

          <div className="space-y-3">
            {currentDay.exercises.map((exercise, eIdx) => {
              const isDone = !!completedExercises[exercise.id];
              return (
                <div
                  key={exercise.id || eIdx}
                  onClick={() => toggleExercise(exercise.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer select-none ${
                    isDone
                      ? 'bg-slate-950/70 border-emerald-500/40 text-slate-400'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-white'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Checkbox */}
                    <button
                      type="button"
                      aria-label="Toggle exercise completion"
                      className="mt-1 text-slate-400 hover:text-emerald-400 transition shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                            {exercise.name}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 font-medium">
                            {exercise.targetMuscle}
                          </span>
                        </div>

                        {/* Sets / Reps / Rest */}
                        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-emerald-400 font-bold border border-slate-700">
                            {exercise.sets} Sets
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-teal-300 font-bold border border-slate-700">
                            {exercise.reps} Reps
                          </span>
                          <span className="px-2 py-1 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exercise.rest}
                          </span>
                        </div>
                      </div>

                      {/* Coach's Tip */}
                      <div className="text-xs text-slate-400 flex items-start gap-1.5 mt-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                        <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-300">Trainer Cue:</strong> {exercise.tips}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cardio Segment */}
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Cardiovascular Recommendation</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentDay.cardio}
          </p>
        </div>

        {/* Cooldown & Nutrition Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cooldown */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Shield className="w-4 h-4" />
              <span>Cool-Down & Mobility Stretch</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentDay.cooldown}
            </p>
          </div>

          {/* Daily Nutrition & Hydration */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Apple className="w-4 h-4" />
              <span>Nutrition & Hydration Tip</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              {currentDay.nutritionTip}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-teal-300 border-t border-slate-800/80 pt-2">
              <Droplets className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{currentDay.hydrationTip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* General Coaching Advice & Rules */}
      {plan.generalAdvice && plan.generalAdvice.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Key Principles for Guaranteed Progress</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.generalAdvice.map((advice, aIdx) => (
              <div
                key={aIdx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {aIdx + 1}
                </span>
                <span>{advice}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback & Plan Refinement Section */}
      <FeedbackSection
        onRegenerate={onRegenerate}
        isLoading={isRegenerating}
        history={plan.feedbackHistory}
        currentVersion={plan.version}
      />
    </div>
  );
};
