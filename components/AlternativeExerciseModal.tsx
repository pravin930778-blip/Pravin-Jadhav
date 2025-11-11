import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Exercise } from '../types';

interface AlternativeExerciseModalProps {
    originalExercise: Exercise;
    onClose: () => void;
    onSelect: (newExercise: Exercise) => void;
}

interface Alternative {
    name: string;
    description: string;
}

const alternativeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'The name of the alternative exercise.' },
        description: { type: Type.STRING, description: 'A brief description of how to perform the exercise.' },
    },
    required: ['name', 'description'],
};


const AlternativeExerciseModal: React.FC<AlternativeExerciseModalProps> = ({ originalExercise, onClose, onSelect }) => {
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchAlternatives = async () => {
            setLoading(true);
            setError('');
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `The user wants to perform "${originalExercise.name}", which is a ${originalExercise.muscleGroup} exercise. The equipment is currently busy. Suggest exactly 3 alternative exercises that target the same muscle group (${originalExercise.muscleGroup}). Provide a short description for each. Return the response as a JSON array.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: Type.ARRAY,
                            items: alternativeSchema,
                        },
                    },
                });

                const parsedResult = JSON.parse(response.text);
                setAlternatives(parsedResult);
            } catch (err) {
                console.error("Error fetching alternatives:", err);
                setError("Could not find alternatives at this time. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlternatives();
    }, [originalExercise]);

    const handleSelect = (alt: Alternative) => {
        const newExercise: Exercise = {
            id: alt.name.toLowerCase().replace(/\s/g, '-'), // Create a new ID
            name: alt.name,
            description: alt.description,
            muscleGroup: originalExercise.muscleGroup, // Keep the same muscle group
        };
        onSelect(newExercise);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface w-full max-w-sm m-4 p-6 rounded-2xl flex flex-col relative shadow-glass border border-white/10 backdrop-blur-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Find an Alternative</h2>
                    <button onClick={onClose} className="text-brand-text-secondary text-2xl font-bold">&times;</button>
                </div>
                
                <div className="min-h-[200px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full pt-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mb-4"></div>
                            <p className="text-brand-text-secondary">Finding alternatives...</p>
                        </div>
                    ) : error ? (
                        <p className="text-red-400 text-center">{error}</p>
                    ) : (
                        <div className="space-y-3">
                            {alternatives.map((alt, index) => (
                                <button key={index} onClick={() => handleSelect(alt)} className="w-full text-left p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <p className="font-semibold text-white">{alt.name}</p>
                                    <p className="text-sm text-brand-text-secondary">{alt.description}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlternativeExerciseModal;
