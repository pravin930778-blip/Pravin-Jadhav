import React, { useState, useEffect } from 'react';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import { Exercise, Set, LoggedExercise } from '../types';
import AlternativeExerciseModal from './AlternativeExerciseModal';
import RestTimer from './RestTimer';

interface WorkoutLoggerProps {
  exercise: Exercise;
  onLogExercise: (loggedExercise: LoggedExercise) => void;
  onCancel: () => void;
  onChangeExercise: (newExercise: Exercise) => void;
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ exercise, onLogExercise, onCancel, onChangeExercise }) => {
  const { getLastSessionForExercise } = useWorkoutLog();
  const [sets, setSets] = useState<Set[]>([{ reps: 0, weight: 0, completed: false }]);
  const [isAlternativesModalOpen, setIsAlternativesModalOpen] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const restDuration = parseInt(localStorage.getItem('restTimerDuration') || '60', 10);

  useEffect(() => {
    const lastSession = getLastSessionForExercise(exercise.id);
    if (lastSession && lastSession.sets.length > 0) {
      setSets(lastSession.sets.map(s => ({ ...s, completed: false })));
    } else {
      // Default sets for a new exercise
      setSets([
        { reps: 8, weight: 50, completed: false },
        { reps: 8, weight: 50, completed: false },
        { reps: 8, weight: 50, completed: false },
      ]);
    }
    setShowRestTimer(false); // Hide timer when exercise changes
  }, [exercise.id, getLastSessionForExercise]);

  const handleSetChange = (index: number, field: 'reps' | 'weight', value: number) => {
    const newSets = [...sets];
    newSets[index][field] = value < 0 ? 0 : value;
    setSets(newSets);
  };

  const toggleSetComplete = (index: number) => {
    const newSets = [...sets];
    const isCompleting = !newSets[index].completed;
    newSets[index].completed = isCompleting;
    setSets(newSets);

    if (isCompleting) {
      setShowRestTimer(true);
      setTimerKey(prevKey => prevKey + 1); // Reset timer animation
    } else {
      setShowRestTimer(false);
    }
  };

  const addSet = () => {
    setShowRestTimer(false);
    const lastSet = sets[sets.length - 1] || { reps: 8, weight: 50, completed: false };
    setSets([...sets, { ...lastSet, completed: false }]);
  };
  
  const handleFinishAndLog = () => {
    const completedSets = sets.filter(s => s.completed);
    if (completedSets.length > 0) {
        const loggedExercise: LoggedExercise = {
            exerciseId: exercise.id,
            sets: completedSets,
        };
        onLogExercise(loggedExercise);
    } else {
        onCancel();
    }
  };
  
  const handleSelectAlternative = (newExercise: Exercise) => {
    onChangeExercise(newExercise);
    setIsAlternativesModalOpen(false);
  }

  return (
    <div className="p-4 space-y-4 flex flex-col h-full">
      <div>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-white">{exercise.name}</h1>
                <p className="text-brand-text-secondary text-sm">{exercise.muscleGroup}</p>
            </div>
            <button 
              onClick={() => setIsAlternativesModalOpen(true)}
              className="p-2 bg-brand-surface rounded-full hover:bg-white/10 transition-colors"
              aria-label="Find alternative exercise"
            >
              <svg className="w-5 h-5 text-brand-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h5v5M9 20H4v-5M15 20h5v-5M9 4H4v5"></path>
              </svg>
            </button>
        </div>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        {sets.map((set, index) => (
          <div key={index} className="flex items-center space-x-2 bg-brand-surface p-2 rounded-lg">
            <button onClick={() => toggleSetComplete(index)} className={`w-10 h-10 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${set.completed ? 'bg-brand-primary border-brand-primary' : 'border-gray-500'}`}>
                <span className={`text-lg font-bold ${set.completed ? 'text-white' : 'text-gray-400'}`}>{index + 1}</span>
            </button>
            <div className="flex-1 text-center">
                <input type="number" value={set.weight} onChange={(e) => handleSetChange(index, 'weight', +e.target.value)} className="bg-transparent w-16 text-center text-white font-bold text-lg" />
                <span className="text-sm text-brand-text-secondary">kg</span>
            </div>
             <div className="flex-1 text-center">
                <input type="number" value={set.reps} onChange={(e) => handleSetChange(index, 'reps', +e.target.value)} className="bg-transparent w-16 text-center text-white font-bold text-lg" />
                <span className="text-sm text-brand-text-secondary">reps</span>
            </div>
            <button onClick={() => toggleSetComplete(index)} className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${set.completed ? 'bg-green-500/20' : 'bg-white/5'}`}>
                <svg className={`w-6 h-6 ${set.completed ? 'text-green-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-4 pt-2">
        {showRestTimer && <RestTimer key={timerKey} duration={restDuration} onFinish={() => setShowRestTimer(false)} />}
        <button onClick={addSet} className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300">
          Add Set
        </button>
        
        <div className="flex space-x-2">
          <button onClick={onCancel} className="w-full py-3 bg-brand-surface rounded-lg text-white font-bold">
              Cancel
          </button>
          <button onClick={handleFinishAndLog} className="w-full py-3 bg-brand-primary rounded-lg text-white font-bold">
              Log Exercise
          </button>
        </div>
      </div>


      {isAlternativesModalOpen && (
        <AlternativeExerciseModal
          originalExercise={exercise}
          onClose={() => setIsAlternativesModalOpen(false)}
          onSelect={handleSelectAlternative}
        />
      )}
    </div>
  );
};

export default WorkoutLogger;