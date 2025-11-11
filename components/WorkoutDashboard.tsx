import React, { useState } from 'react';
import { MOCK_EXERCISE_DATABASE } from '../constants';
import { Exercise, View, WorkoutSession, LoggedExercise, Set } from '../types';
import WorkoutLogger from './WorkoutLogger';
import { useWorkoutLog } from '../hooks/useWorkoutLog';


interface WorkoutDashboardProps {
  setView: (view: View) => void;
}

const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({ setView }) => {
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([]);
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);

  const { addWorkoutSession } = useWorkoutLog();

  const handleLogExercise = (loggedExercise: LoggedExercise) => {
    setLoggedExercises(prev => [...prev.filter(ex => ex.exerciseId !== loggedExercise.exerciseId), loggedExercise]);
    setCurrentExercise(null);
  };
  
  const handleAddExercise = (exercise: Exercise) => {
    if (!sessionExercises.find(ex => ex.id === exercise.id)) {
        setSessionExercises(prev => [...prev, exercise]);
    }
    setIsAddingExercise(false);
  }

  const handleFinishSession = () => {
    if (loggedExercises.length > 0) {
        const newSession: Omit<WorkoutSession, 'id' | 'date'> = {
            name: `Workout Session on ${new Date().toLocaleDateString()}`,
            exercises: loggedExercises
        };
        addWorkoutSession(newSession);
    }
    setView('dashboard');
  }

  if (currentExercise) {
    return <WorkoutLogger 
              exercise={currentExercise} 
              onLogExercise={handleLogExercise}
              onCancel={() => setCurrentExercise(null)}
              onChangeExercise={setCurrentExercise}
           />;
  }
  
  if (isAddingExercise) {
    return (
        <div className="p-4 space-y-4">
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Add Exercise</h1>
                <button onClick={() => setIsAddingExercise(false)} className="text-brand-text-secondary">Done</button>
            </header>
            <div className="space-y-2">
                {MOCK_EXERCISE_DATABASE.map(ex => (
                    <button
                    key={ex.id}
                    onClick={() => handleAddExercise(ex)}
                    className="w-full text-left p-3 bg-brand-surface rounded-lg hover:bg-white/10 flex justify-between items-center"
                    >
                    <div>
                        <p className="font-semibold text-white">{ex.name}</p>
                        <p className="text-sm text-brand-text-secondary">{ex.muscleGroup}</p>
                    </div>
                    {sessionExercises.find(sesEx => sesEx.id === ex.id) && <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </button>
                ))}
            </div>
        </div>
    )
  }
  
  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Today's Session</h1>
        <button onClick={() => setView('dashboard')} className="text-brand-text-secondary">Cancel</button>
      </header>

      <div className="bg-brand-surface p-4 rounded-xl min-h-[300px]">
        <h2 className="text-lg font-semibold text-white mb-2">Planned Exercises</h2>
        <div className="space-y-2">
            {sessionExercises.length > 0 ? (
                sessionExercises.map(ex => {
                    const isCompleted = loggedExercises.some(loggedEx => loggedEx.exerciseId === ex.id);
                    return (
                        <button
                            key={ex.id}
                            onClick={() => setCurrentExercise(ex)}
                            className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 flex items-center justify-between"
                        >
                            <div>
                                <p className={`font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>{ex.name}</p>
                                <p className="text-sm text-brand-text-secondary">{ex.muscleGroup}</p>
                            </div>
                            {isCompleted && <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        </button>
                    )
                })
            ) : (
                <p className="text-center text-brand-text-secondary py-8">Add an exercise to get started.</p>
            )}
            <button onClick={() => setIsAddingExercise(true)} className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <span>Add Exercise</span>
            </button>
        </div>
      </div>
      
      <button 
        onClick={handleFinishSession}
        disabled={loggedExercises.length === 0}
        className="w-full py-3 bg-brand-primary rounded-lg text-white font-bold mt-4 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        Finish Session
      </button>
    </div>
  );
};

export default WorkoutDashboard;