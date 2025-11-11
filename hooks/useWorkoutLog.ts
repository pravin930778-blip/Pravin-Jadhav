import { useState, useEffect, useCallback } from 'react';
import { type WorkoutSession, type LoggedExercise, type Exercise } from '../types';
import { MOCK_EXERCISE_DATABASE } from '../constants';
import { auth, db } from '../firebase';
// Fix: Import firebase compat for Timestamp type and value
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


export const useWorkoutLog = () => {
  const [workoutLog, setWorkoutLog] = useState<WorkoutSession[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
        setWorkoutLog([]);
        return;
    }

    // Fix: Use v8/compat syntax for collection reference
    const logCollectionRef = db.collection('users').doc(user.uid).collection('workoutLog');
    // Fix: Use v8/compat syntax for query and orderBy
    const q = logCollectionRef.orderBy('date', 'desc');

    // Fix: Use v8/compat syntax for onSnapshot
    const unsubscribe = q.onSnapshot((snapshot) => {
        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Fix: Use firebase.firestore.Timestamp for type assertion
                // Convert Firestore Timestamp to ISO string to match the original type
                date: (data.date as firebase.firestore.Timestamp).toDate().toISOString(),
            } as WorkoutSession;
        });
        setWorkoutLog(logs);
    }, (error) => {
        console.error("Error fetching workout logs: ", error);
    });

    return () => unsubscribe();
  }, [user]);

  const addWorkoutSession = useCallback(async (session: Omit<WorkoutSession, 'id' | 'date'>) => {
    if (!user) return;
    // Fix: Use v8/compat syntax for collection reference
    const logCollectionRef = db.collection('users').doc(user.uid).collection('workoutLog');
    try {
        // Fix: Use v8/compat syntax for addDoc and Timestamp
        await logCollectionRef.add({
            ...session,
            date: firebase.firestore.Timestamp.now()
        });
    } catch (error) {
        console.error("Error adding workout session: ", error);
    }
  }, [user]);

  const getLastSessionForExercise = useCallback((exerciseId: string): LoggedExercise | null => {
    for (const session of workoutLog) {
      const foundExercise = session.exercises.find(ex => ex.exerciseId === exerciseId);
      if (foundExercise) {
        return foundExercise;
      }
    }
    return null;
  }, [workoutLog]);
  
  const getExerciseHistory = useCallback((exerciseId: string): { date: string, weight: number }[] => {
    const history: { date: string, weight: number }[] = [];
    // The log is already sorted descending, so iterate forwards and reverse at the end
    for (const session of workoutLog) {
        const foundExercise = session.exercises.find(ex => ex.exerciseId === exerciseId);
        if (foundExercise) {
            const maxWeight = Math.max(...foundExercise.sets.filter(s=>s.completed).map(s => s.weight));
            if(maxWeight > 0 && isFinite(maxWeight)) {
                 history.push({ date: session.date, weight: maxWeight });
            }
        }
    }
    return history.reverse(); // reverse to get chronological order
  }, [workoutLog]);

  const getMostRecentExerciseHistory = useCallback((): { exercise?: Exercise, history: { date: string, weight: number }[] } => {
    if (workoutLog.length === 0 || workoutLog[0].exercises.length === 0) {
      const defaultExercise = MOCK_EXERCISE_DATABASE[0];
      return { exercise: defaultExercise, history: getExerciseHistory(defaultExercise.id) };
    }

    const mostRecentExerciseId = workoutLog[0].exercises[0].exerciseId;
    const exercise = MOCK_EXERCISE_DATABASE.find(ex => ex.id === mostRecentExerciseId);
    const history = getExerciseHistory(mostRecentExerciseId);

    return { exercise, history };
  }, [workoutLog, getExerciseHistory]);
  
  const getAnalyticsData = useCallback((period: 'Week' | 'Month' | 'Year') => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    let startDate = new Date(endDate);
    let numDataPoints: number;
    let labels: string[] = [];

    switch (period) {
        case 'Week':
            numDataPoints = 7;
            startDate.setDate(startDate.getDate() - (numDataPoints - 1));
            startDate.setHours(0, 0, 0, 0);
            for (let i = 0; i < numDataPoints; i++) {
                const d = new Date(startDate);
                d.setDate(d.getDate() + i);
                labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
            }
            break;
        case 'Month':
            numDataPoints = 4; // 4 weeks
            startDate.setDate(startDate.getDate() - (numDataPoints * 7 - 1));
            startDate.setHours(0, 0, 0, 0);
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            break;
        case 'Year':
            numDataPoints = 12; // 12 months
            startDate = new Date(now.getFullYear(), 0, 1);
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            break;
    }

    const relevantSessions = workoutLog.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startDate && sessionDate <= endDate;
    });

    const weightData = Array(numDataPoints).fill(0);
    const frequencyData = Array(numDataPoints).fill(0);

    relevantSessions.forEach(session => {
        const sessionDate = new Date(session.date);
        let index = -1;

        switch (period) {
            case 'Week':
                index = Math.floor((sessionDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
                break;
            case 'Month':
                index = Math.floor((sessionDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7));
                break;
            case 'Year':
                index = sessionDate.getMonth();
                break;
        }

        if (index >= 0 && index < numDataPoints) {
            const totalWeight = session.exercises.reduce((total, ex) =>
                total + ex.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0), 0);
            
            weightData[index] += totalWeight;
            frequencyData[index]++;
        }
    });

    const calculatePercentageChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    let prevStartDate: Date;
    let prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    prevEndDate.setHours(23, 59, 59, 999);

    switch (period) {
        case 'Week':
            prevStartDate = new Date(startDate);
            prevStartDate.setDate(prevStartDate.getDate() - 7);
            break;
        case 'Month':
            prevStartDate = new Date(startDate);
            prevStartDate.setDate(prevStartDate.getDate() - (4 * 7));
            break;
        case 'Year':
            prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
            prevEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;
    }

    const prevRelevantSessions = workoutLog.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= prevStartDate && sessionDate <= prevEndDate;
    });

    const totalWeight = relevantSessions.reduce((total, session) =>
        total + session.exercises.reduce((exTotal, ex) =>
            exTotal + ex.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0), 0), 0);

    const totalWorkouts = relevantSessions.length;

    const prevTotalWeight = prevRelevantSessions.reduce((total, session) =>
        total + session.exercises.reduce((exTotal, ex) =>
            exTotal + ex.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0), 0), 0);
    
    const prevTotalWorkouts = prevRelevantSessions.length;

    const weightChange = calculatePercentageChange(totalWeight, prevTotalWeight);
    const frequencyChange = calculatePercentageChange(totalWorkouts, prevTotalWorkouts);

    return { labels, weightData, frequencyData, totalWeight, totalWorkouts, weightChange, frequencyChange };
  }, [workoutLog]);


  return { workoutLog, addWorkoutSession, getLastSessionForExercise, getExerciseHistory, getMostRecentExerciseHistory, getAnalyticsData };
};