import React, { useState, useMemo } from 'react';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import { MOCK_EXERCISE_DATABASE } from '../constants';
import PlansScreen from './PlansScreen'; // Import the AI planner screen

type DateFilter = 'All Time' | 'Last 7 Days' | 'Last 30 Days';
type LogbookTab = 'history' | 'plan';

const LogbookScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LogbookTab>('history');
  const { workoutLog } = useWorkoutLog();
  const [dateFilter, setDateFilter] = useState<DateFilter>('All Time');
  const [exerciseFilter, setExerciseFilter] = useState<string>('All');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const filteredLog = useMemo(() => {
    let log = [...workoutLog];

    if (dateFilter !== 'All Time') {
      const days = dateFilter === 'Last 7 Days' ? 7 : 30;
      const cutoffDate = new Date();
      cutoffDate.setHours(0, 0, 0, 0);
      cutoffDate.setDate(cutoffDate.getDate() - days);
      log = log.filter(session => new Date(session.date) >= cutoffDate);
    }

    if (exerciseFilter !== 'All') {
      log = log.filter(session =>
        session.exercises.some(ex => ex.exerciseId === exerciseFilter)
      );
    }

    return log;
  }, [workoutLog, dateFilter, exerciseFilter]);

  const DateFilterButton: React.FC<{label: DateFilter}> = ({label}) => (
      <button
          onClick={() => setDateFilter(label)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${dateFilter === label ? 'bg-brand-primary text-white' : 'bg-brand-surface text-brand-text-secondary'}`}
      >
          {label}
      </button>
  );

  const Stat: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
    <div className="flex items-center space-x-2">
      <div className="text-brand-primary-light">{icon}</div>
      <div>
        <p className="font-bold text-white text-sm">{value}</p>
        <p className="text-xs text-brand-text-secondary">{label}</p>
      </div>
    </div>
  );
  
  const TabButton: React.FC<{label: string; tab: LogbookTab}> = ({label, tab}) => (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === tab ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary border-b-2 border-transparent'}`}
      >
        {label}
      </button>
  );

  return (
    <div className="p-4 space-y-4 flex flex-col h-full">
      <header>
          <h1 className="text-2xl font-bold text-white">Logbook</h1>
          <p className="text-brand-text-secondary">Review history and create plans.</p>
      </header>
      
      <div className="flex border-b border-white/10">
        <TabButton label="Workout History" tab="history" />
        <TabButton label="AI Exercise Plan" tab="plan" />
      </div>

      {activeTab === 'history' ? (
        <div className="space-y-4 overflow-y-auto">
          {/* Filters */}
          <div className="space-y-4 bg-brand-surface p-4 rounded-xl">
            <div className="flex items-center space-x-2">
                <DateFilterButton label="All Time" />
                <DateFilterButton label="Last 7 Days" />
                <DateFilterButton label="Last 30 Days" />
            </div>
            <div>
                <select
                  value={exerciseFilter}
                  onChange={(e) => setExerciseFilter(e.target.value)}
                  className="w-full p-2 bg-black/30 rounded-lg text-white border border-gray-700 focus:ring-brand-primary focus:border-brand-primary"
                >
                  <option value="All">All Exercises</option>
                  {MOCK_EXERCISE_DATABASE.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
            </div>
          </div>
          
          {/* Log list */}
          <div className="space-y-3 pb-20">
            {filteredLog.length > 0 ? filteredLog.map(session => {
              const totalExercises = session.exercises.length;
              const totalWeight = session.exercises.reduce((acc, ex) =>
                acc + ex.sets.reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0), 0);
              
              const isExpanded = expandedSessionId === session.id;

              return (
                <div key={session.id} className="bg-brand-surface rounded-xl p-4 animate-fadeInUp">
                    <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}>
                        <div>
                            <p className="font-bold text-white">{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm text-brand-text-secondary">{session.name}</p>
                        </div>
                        <button className="text-brand-text-secondary text-xl transition-transform" style={{transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}}>▼</button>
                    </div>

                    <div className="border-t border-white/10 my-3"></div>

                    <div className="grid grid-cols-2 gap-4">
                         <Stat
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                            value={`${totalExercises} Exercises`}
                            label="Performed"
                         />
                         <Stat
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>}
                            value={`${Math.round(totalWeight).toLocaleString()} kg`}
                            label="Total Volume"
                         />
                    </div>
                    
                    {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                            {session.exercises.map((ex, idx) => {
                                const exerciseInfo = MOCK_EXERCISE_DATABASE.find(dbEx => dbEx.id === ex.exerciseId);
                                return (
                                    <div key={idx} className="text-sm">
                                        <p className="font-semibold text-white">{exerciseInfo?.name || 'Unknown Exercise'}</p>
                                        <div className="pl-4 text-brand-text-secondary">
                                            {ex.sets.map((set, setIdx) => (
                                                <p key={setIdx}>Set {setIdx + 1}: {set.weight}kg x {set.reps} reps</p>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
              )
            }) : (
                <div className="text-center py-16">
                    <svg className="w-16 h-16 mx-auto text-brand-text-secondary/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    <p className="font-semibold text-white">No Workouts Found</p>
                    <p className="text-brand-text-secondary">Try adjusting your filters or log a new workout.</p>
                </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <PlansScreen />
        </div>
      )}
    </div>
  );
};

export default LogbookScreen;