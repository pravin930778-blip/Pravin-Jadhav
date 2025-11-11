import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { WorkoutSession } from '../types';

interface ProgressFeedbackModalProps {
    onClose: () => void;
    workoutLog: WorkoutSession[];
}

const ProgressFeedbackModal: React.FC<ProgressFeedbackModalProps> = ({ onClose, workoutLog }) => {
    const [feedback, setFeedback] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getFeedback = async () => {
            if (workoutLog.length === 0) {
                setFeedback("Start logging your workouts to get personalized feedback on your progress!");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                // Serialize the last 5 sessions for context
                const recentSessions = workoutLog.slice(0, 5).map(session => 
                    `On ${new Date(session.date).toLocaleDateString()}, user performed: ${session.exercises.map(ex => `${ex.exerciseId} with ${ex.sets.length} sets`).join(', ')}.`
                ).join('\n');
                
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `You are a friendly and encouraging fitness coach. Here is a summary of a user's last few workouts:\n${recentSessions}\n\nAnalyze their progress and consistency. Provide a short, positive, and actionable piece of feedback. Keep it under 60 words.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                setFeedback(response.text);
            } catch (err) {
                console.error("Error getting feedback:", err);
                setError("Sorry, I couldn't analyze your progress right now.");
            } finally {
                setLoading(false);
            }
        };

        getFeedback();
    }, [workoutLog]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface w-full max-w-sm m-4 p-6 rounded-2xl flex flex-col relative shadow-glass border border-white/10 backdrop-blur-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Progress Analysis</h2>
                    <button onClick={onClose} className="text-brand-text-secondary text-2xl font-bold">&times;</button>
                </div>
                
                <div className="min-h-[100px] flex items-center justify-center">
                    {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    ) : error ? (
                        <p className="text-red-400 text-center">{error}</p>
                    ) : (
                        <p className="text-white text-center italic">"{feedback}"</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressFeedbackModal;
