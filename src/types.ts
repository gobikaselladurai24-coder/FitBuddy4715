export interface UserProfile {
  name: string;
  age: number;
  weight: number; // in kg
  goal: string;
  intensity: 'Low' | 'Medium' | 'High';
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  preference: 'Home Workout' | 'Gym Workout' | 'Calisthenics' | 'Minimal Equipment';
  targetDaysPerWeek?: number;
  additionalNotes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  targetMuscle: string;
  tips: string;
  equipment?: string;
}

export interface DayPlan {
  dayNumber: number;
  dayName: string;
  focus: string;
  isRestDay: boolean;
  warmup: string;
  exercises: Exercise[];
  cardio: string;
  cooldown: string;
  nutritionTip: string;
  hydrationTip: string;
}

export interface FeedbackRecord {
  feedback: string;
  appliedAt: string;
  summaryOfChanges: string;
}

export interface FitnessPlan {
  id: string;
  title: string;
  overview: string;
  user: UserProfile;
  createdAt: string;
  version: number;
  weeklyTargetCalories: number;
  targetProteinGrams: number;
  cardioMinutesWeekly: number;
  recoveryDaysCount: number;
  days: DayPlan[];
  generalAdvice: string[];
  feedbackHistory?: FeedbackRecord[];
}
