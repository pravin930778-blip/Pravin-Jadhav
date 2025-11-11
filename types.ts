import React from 'react';

export type View = 'dashboard' | 'workout' | 'diet' | 'logbook' | 'tips' | 'analytics' | 'achievements' | 'profile' | 'plans';

// Diet related types
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Additional Eated';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  type: MealType;
  items: FoodItem[];
}

export interface DailyLog {
  date: string;
  meals: Meal[];
}

// Workout related types
export interface Set {
    reps: number;
    weight: number;
    completed: boolean;
}

export interface LoggedExercise {
    exerciseId: string;
    sets: Set[];
}

export interface WorkoutSession {
    id:string;
    date: string;
    name: string;
    exercises: LoggedExercise[];
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string;
    description: string;
}

// Achievements related types
export type AchievementCategory = 'All' | 'Consistency' | 'Strength' | 'Community' | 'Cardio';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    category: AchievementCategory;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Streak {
    title: string;
    description: string;
    progress: number;
    total: number;
}