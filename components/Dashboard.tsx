import React, { useState } from 'react';
import { View } from '../types';
import { useDailyLog } from '../hooks/useDailyLog';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import CalorieSummary from './CalorieSummary';
import MacroSummary from './MacroSummary';
import ProgressChart from './ProgressChart';
import { auth } from '../firebase';
import ProgressFeedbackModal from './ProgressFeedbackModal';

interface DashboardProps {
    setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    const { getMacros } = useDailyLog();
    const { getMostRecentExerciseHistory, workoutLog } = useWorkoutLog();
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    
    const macros = getMacros();
    const calorieGoal = 2500; // This could be dynamic later
    const { exercise, history } = getMostRecentExerciseHistory();

    const user = auth.currentUser;
    const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
    
    const QuickActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; sublabel: string;}> = ({ onClick, icon, label, sublabel }) => (
        <button onClick={onClick} className="bg-brand-surface p-4 rounded-2xl w-full flex items-center space-x-4 hover:bg-white/5 transition-colors">
            <div className="bg-brand-primary/20 text-brand-primary p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="font-bold text-white text-left">{label}</p>
                <p className="text-sm text-brand-text-secondary text-left">{sublabel}</p>
            </div>
        </button>
    );

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Hello, {displayName}</h1>
                    <p className="text-brand-text-secondary">Ready to crush your goals today?</p>
                </div>
                <button onClick={() => setView('profile')} className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </button>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                    onClick={() => setView('workout')}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>}
                    label="Start Workout"
                    sublabel="Begin a new session"
                />
                <QuickActionButton
                    onClick={() => setView('diet')}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    label="Log a Meal"
                    sublabel="Track your nutrition"
                />
            </div>
            
            <div className="space-y-4">
                 <h2 className="text-xl font-bold text-white">Today's Nutrition</h2>
                 <CalorieSummary calories={macros.calories} goal={calorieGoal} />
                 <MacroSummary protein={macros.protein} carbs={macros.carbs} fat={macros.fat} />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Workout Progress</h2>
                </div>
                <div className="bg-brand-surface rounded-2xl min-h-[292px] flex items-center justify-center">
                    {exercise && history.length > 1 ? (
                        <ProgressChart exerciseName={exercise.name} data={history} />
                    ) : (
                        <div className="text-center p-8">
                            <p className="text-brand-text-secondary">Log a workout to see your progress chart here.</p>
                        </div>
                    )}
                </div>
                 <button
                    onClick={() => setView('analytics')}
                    className="w-full py-3 bg-brand-surface-light rounded-lg text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
                >
                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    <span>View Full Analytics</span>
                </button>
                <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="w-full py-3 bg-brand-surface-light rounded-lg text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
                >
                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    <span>Feedback</span>
                </button>
            </div>
            
            {isFeedbackModalOpen && (
                <ProgressFeedbackModal 
                    onClose={() => setIsFeedbackModalOpen(false)}
                    workoutLog={workoutLog}
                />
            )}
        </div>
    );
};

export default Dashboard;