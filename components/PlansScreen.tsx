import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

type Goal = 'Lose Weight' | 'Build Muscle' | 'Improve Endurance' | 'Maintain Fitness';
type Frequency = '1-2 times/week' | '3-4 times/week' | '5+ times/week';

const PlansScreen: React.FC = () => {
    const [plan, setPlan] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    // State for user inputs
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [goal, setGoal] = useState<Goal>('Build Muscle');
    const [frequency, setFrequency] = useState<Frequency>('3-4 times/week');
    const [preferences, setPreferences] = useState('');

    const isFormValid = age && weight && height && goal && frequency;

    const generatePlan = async () => {
        if (!isFormValid) return;

        setLoading(true);
        setError('');
        setPlan('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
Act as an elite personal trainer and nutritionist, creating a bespoke plan for a client with the following profile:
- Age: ${age} years
- Weight: ${weight} kg
- Height: ${height} cm
- Main Fitness Goal: ${goal}
- Available Workouts per Week: ${frequency}
- Dietary Notes: ${preferences || 'None specified'}

Your task is to generate a detailed and actionable 3-day sample plan to help them achieve their goal. The plan must be holistic, covering both exercise and nutrition.

**Workout Plan Structure (for each day):**
1.  **Warm-up:** A brief, dynamic warm-up routine (e.g., 5-10 minutes).
2.  **Main Workout:** List specific exercises with precise sets, reps, and recommended rest periods. Choose exercises that are effective for their goal.
3.  **Cool-down:** A short cool-down with static stretches.

**Diet Plan Structure (for each day):**
1.  Provide meal suggestions for Breakfast, Lunch, Dinner, and one Snack.
2.  For each meal, give an estimated breakdown of macronutrients (Protein, Carbs, Fat) and total calories.
3.  Ensure the overall daily caloric and macro targets align with their goal (${goal}).

**Formatting:**
- Use clean markdown.
- Use bold headings for each day (e.g., **Day 1: Push Day**).
- Use subheadings for "Workout Details" and "Nutrition Plan".
- Use bullet points for exercises and meal items.

Conclude with a short, motivational tip. Generate the plan now.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
            });
            
            setPlan(response.text);
        } catch (err) {
            console.error("Error generating plan:", err);
            setError("Could not generate a plan. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const goals: Goal[] = ['Build Muscle', 'Lose Weight', 'Improve Endurance', 'Maintain Fitness'];
    const frequencies: Frequency[] = ['1-2 times/week', '3-4 times/week', '5+ times/week'];

    return (
        <div className="p-4 space-y-4 h-full flex flex-col relative overflow-hidden">
             {/* Background Glow Effect */}
            <div className="absolute w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-3xl -bottom-1/4 right-1/2 translate-x-1/2 pointer-events-none"></div>

            <header>
                <h1 className="text-2xl font-bold text-white">AI Fitness Planner</h1>
                <p className="text-brand-text-secondary">Tell us about yourself for a tailored plan.</p>
            </header>
            
            {/* Conditional Rendering: Show form or plan */}
            {!plan && !loading ? (
                <div className="space-y-4 overflow-y-auto z-10 p-1">
                    {/* Biometrics */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-sm text-brand-text-secondary">Age</label>
                            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 25" className="w-full mt-1 p-2 bg-brand-surface rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="text-sm text-brand-text-secondary">Weight (kg)</label>
                            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 75" className="w-full mt-1 p-2 bg-brand-surface rounded-lg text-white" />
                        </div>
                         <div>
                            <label className="text-sm text-brand-text-secondary">Height (cm)</label>
                            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 180" className="w-full mt-1 p-2 bg-brand-surface rounded-lg text-white" />
                        </div>
                    </div>
                    {/* Goal */}
                    <div>
                         <label className="text-sm text-brand-text-secondary mb-2 block">Your Goal</label>
                         <div className="grid grid-cols-2 gap-2">
                             {goals.map(g => <button key={g} onClick={() => setGoal(g)} className={`p-3 text-sm rounded-lg text-center transition-colors ${goal === g ? 'bg-brand-primary text-white font-semibold' : 'bg-brand-surface text-brand-text'}`}>{g}</button>)}
                         </div>
                    </div>
                    {/* Frequency */}
                    <div>
                         <label className="text-sm text-brand-text-secondary mb-2 block">Workout Frequency</label>
                         <div className="flex bg-brand-surface rounded-lg p-1">
                             {frequencies.map(f => <button key={f} onClick={() => setFrequency(f)} className={`flex-1 p-2 text-sm rounded-md transition-colors ${frequency === f ? 'bg-brand-primary text-white font-semibold' : 'bg-transparent text-brand-text'}`}>{f}</button>)}
                         </div>
                    </div>
                     {/* Preferences */}
                    <div>
                         <label className="text-sm text-brand-text-secondary">Dietary Preferences (Optional)</label>
                         <input type="text" value={preferences} onChange={e => setPreferences(e.target.value)} placeholder="e.g. Vegetarian, no nuts" className="w-full mt-1 p-2 bg-brand-surface rounded-lg text-white" />
                    </div>
                    
                    <button
                        onClick={generatePlan}
                        disabled={!isFormValid || loading}
                        className="w-full mt-4 text-white font-bold py-3 rounded-xl bg-brand-primary hover:bg-opacity-90 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        <span>Generate My Plan</span>
                    </button>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto bg-brand-surface rounded-2xl p-4 z-10 min-h-0">
                    {loading && (
                         <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary mb-4"></div>
                            <p className="text-white font-semibold">Crafting your personalized plan...</p>
                            <p className="text-sm text-brand-text-secondary">This can take up to 30 seconds.</p>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {plan && (
                        <div>
                             <div className="text-brand-text-secondary whitespace-pre-wrap font-mono text-sm" dangerouslySetInnerHTML={{ __html: plan.replace(/(\b(Day \d+|Workout|Diet|Breakfast|Lunch|Dinner|Exercises)\b)/g, '<span class="text-white font-bold">$1</span>') }} />
                             <button
                                onClick={() => setPlan('')}
                                className="w-full mt-4 text-white font-bold py-2 rounded-xl bg-brand-primary-light/50 hover:bg-brand-primary-light/80 transition-all duration-300"
                             >
                                 Create New Plan
                             </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlansScreen;