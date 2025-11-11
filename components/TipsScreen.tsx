import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const TipsScreen: React.FC = () => {
    const [tip, setTip] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchTip = async () => {
            setLoading(true);
            setError('');
            try {
                // Fix: Per guidelines, assume API_KEY is present and remove explicit check.
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: 'Give me a short, inspiring, and actionable fitness or nutrition tip for today. Less than 50 words.',
                });
                
                setTip(response.text);
            } catch (err) {
                console.error(err);
                setError('Could not fetch a tip. Please try again later.');
                setTip('Consistency is key. Even a short workout is better than no workout. Keep showing up for yourself!'); // Fallback tip
            } finally {
                setLoading(false);
            }
        };

        fetchTip();
    }, []);

    return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold text-white mb-6">Daily Tip</h1>
            <div className="bg-brand-surface backdrop-blur-lg border border-white/10 shadow-glass p-8 rounded-2xl max-w-md">
                <svg className="w-12 h-12 mx-auto text-brand-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                {loading ? (
                    <p className="text-brand-text-secondary">Fetching your daily inspiration...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <p className="text-white text-lg italic">"{tip}"</p>
                )}
            </div>
        </div>
    );
};

export default TipsScreen;