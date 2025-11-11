import React, { useState, useMemo } from 'react';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import WeightOverTimeChart from './charts/WeightOverTimeChart';
import WorkoutCalendar from './charts/WorkoutCalendar';
import { MOCK_EXERCISE_DATABASE } from '../constants';

type Period = 'Week' | 'Month' | 'Year';

const AnalyticsScreen: React.FC = () => {
    const [period, setPeriod] = useState<Period>('Month');
    const { getAnalyticsData, workoutLog } = useWorkoutLog();

    const analyticsData = useMemo(() => getAnalyticsData(period), [period, getAnalyticsData]);
    const workoutDates = useMemo(() => workoutLog.map(session => session.date), [workoutLog]);
    
    const todaysWorkout = useMemo(() => {
        if (workoutLog.length === 0) return null;

        const mostRecentSession = workoutLog[0];
        const sessionDate = new Date(mostRecentSession.date);
        const today = new Date();
        
        const isToday = sessionDate.getFullYear() === today.getFullYear() &&
                        sessionDate.getMonth() === today.getMonth() &&
                        sessionDate.getDate() === today.getDate();

        if (isToday) {
            return mostRecentSession;
        }
        return null;
    }, [workoutLog]);

    const FilterButton: React.FC<{label: Period}> = ({label}) => (
        <button
            onClick={() => setPeriod(label)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${period === label ? 'bg-brand-primary text-white' : 'bg-brand-surface-light text-brand-text-secondary'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-black min-h-full text-brand-text p-4">
            <header className="flex items-center justify-between mb-6">
                <button className="p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                <h1 className="text-xl font-bold">Analytics</h1>
                <button className="p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg></button>
            </header>

            <div className="flex items-center space-x-2 mb-6">
                <FilterButton label="Week" />
                <FilterButton label="Month" />
                <FilterButton label="Year" />
            </div>

            <div className="space-y-6">
                {/* Activity Calendar Card */}
                <div className="bg-[#1C1C1E] p-4 rounded-2xl">
                    <p className="text-brand-text-secondary text-sm">Activity Calendar</p>
                    <p className="text-3xl font-bold my-1">Workout Goals</p>
                    <WorkoutCalendar workoutDates={workoutDates} />
                </div>
                
                {/* Weight Lifted Card */}
                <div className="bg-[#1C1C1E] p-4 rounded-2xl">
                    <p className="text-brand-text-secondary text-sm">Weight Lifted Over Time</p>
                    <p className="text-3xl font-bold my-1">{analyticsData.totalWeight.toLocaleString()} kg</p>
                    <p className="text-green-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                        {analyticsData.weightChange}% This Month
                    </p>
                    <WeightOverTimeChart labels={analyticsData.labels} data={analyticsData.weightData} />
                </div>

                {/* Today's Exercise Card */}
                <div className="bg-[#1C1C1E] p-4 rounded-2xl min-h-[290px] flex flex-col">
                    <p className="text-brand-text-secondary text-sm">Today's Exercise</p>
                    {todaysWorkout ? (
                        <>
                            <p className="text-3xl font-bold my-1">{todaysWorkout.exercises.length} Exercises Logged</p>
                            <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1">
                                {todaysWorkout.exercises.map((ex, index) => {
                                    const exerciseInfo = MOCK_EXERCISE_DATABASE.find(dbEx => dbEx.id === ex.exerciseId);
                                    return (
                                        <div key={index} className="bg-brand-surface p-2 rounded-lg text-sm">
                                            <p className="font-semibold text-white">{exerciseInfo?.name || 'Unknown Exercise'}</p>
                                            <p className="text-brand-text-secondary">{ex.sets.length} sets completed</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <svg className="w-12 h-12 text-brand-text-secondary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            <p className="text-brand-text-secondary font-semibold">No Workout Logged Today</p>
                            <p className="text-xs text-brand-text-secondary/70">Finish a session to see it here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsScreen;