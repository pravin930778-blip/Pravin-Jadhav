import { DailyLog, FoodItem, Exercise, Achievement, Streak } from './types';
import React from 'react';

// A generic icon component for achievements, converted to React.createElement to avoid syntax errors in a .ts file.
const PlaceholderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { ...props, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" })
    )
);


export const MOCK_FOOD_DATABASE: FoodItem[] = [
  { id: '1', name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: '2', name: 'Brown Rice (1 cup cooked)', calories: 215, protein: 5, carbs: 45, fat: 1.8 },
  { id: '3', name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { id: '4', name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fat: 12 },
  { id: '5', name: 'Apple (medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: '6', name: 'Almonds (1/4 cup)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { id: '7', name: 'Roti', calories: 110, protein: 3, carbs: 20, fat: 1.5 },
  { id: '8', name: 'Rice', calories: 200, protein: 4, carbs: 45, fat: 0.5 },
  { id: '9', name: 'Dal', calories: 150, protein: 9, carbs: 20, fat: 4 },
  { id: '10', name: 'Sabzi', calories: 120, protein: 3, carbs: 12, fat: 6 },
  { id: '11', name: 'Curd', calories: 60, protein: 3, carbs: 4, fat: 3 },
  { id: '12', name: 'Protein Scoop', calories: 120, protein: 24, carbs: 3, fat: 1.5 },

];

export const MOCK_DAILY_LOG: DailyLog = {
  date: new Date().toISOString().split('T')[0],
  meals: [
    { type: 'Breakfast', items: [] },
    { type: 'Lunch', items: [] },
    { type: 'Dinner', items: [] },
    { type: 'Snacks', items: [] },
  ],
};

export const MOCK_EXERCISE_DATABASE: Exercise[] = [
    { id: 'ex1', name: 'Barbell Bench Press', muscleGroup: 'Chest', description: 'A compound exercise for the upper body.' },
    { id: 'ex2', name: 'Squat', muscleGroup: 'Legs', description: 'A compound exercise for the lower body.' },
    { id: 'ex3', name: 'Deadlift', muscleGroup: 'Back & Legs', description: 'A compound exercise for the entire posterior chain.' },
    { id: 'ex4', name: 'Overhead Press', muscleGroup: 'Shoulders', description: 'A compound exercise for the shoulders and upper body.' },
    { id: 'ex5', name: 'Pull Up', muscleGroup: 'Back', description: 'A bodyweight exercise for the back and biceps.' },
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
    { id: 'a1', title: 'First Workout', description: 'Log your first session', unlocked: true, category: 'Consistency', icon: PlaceholderIcon },
    { id: 'a2', title: 'Week Streak', description: 'Workout 7 days in a row', unlocked: true, category: 'Consistency', icon: PlaceholderIcon },
    { id: 'a3', title: 'Bench Press Pro', description: 'Lift 100kg on Bench Press', unlocked: false, category: 'Strength', icon: PlaceholderIcon },
    { id: 'a4', title: 'Cardio King', description: 'Run a 5k', unlocked: true, category: 'Cardio', icon: PlaceholderIcon },
    { id: 'a5', title: 'Social Butterfly', description: 'Share a workout', unlocked: false, category: 'Community', icon: PlaceholderIcon },
    { id: 'a6', title: 'Perfect Month', description: 'Workout every day for a month', unlocked: false, category: 'Consistency', icon: PlaceholderIcon },
];

export const STREAK_DATA: Streak = {
    title: 'Weekly Workout Streak',
    description: 'Log a workout every day this week to earn a badge!',
    progress: 3,
    total: 7
};