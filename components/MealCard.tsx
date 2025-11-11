import React from 'react';
import { Meal } from '../types';

interface MealCardProps {
    meal: Meal;
    onAddFood: () => void;
    onScanMeal: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onAddFood, onScanMeal }) => {
    const totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);

    return (
        <div className="bg-brand-surface p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h3 className="text-lg font-bold text-white">{meal.type}</h3>
                    <p className="text-sm text-brand-text-secondary">{totalCalories.toFixed(0)} kcal</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={onScanMeal} className="bg-brand-primary/20 text-brand-primary p-2 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                    <button onClick={onAddFood} className="bg-brand-primary/20 text-brand-primary p-2 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                </div>
            </div>
            <div className="space-y-2">
                {meal.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <p className="text-brand-text">{item.name}</p>
                        <p className="text-brand-text-secondary">{item.calories.toFixed(0)} kcal</p>
                    </div>
                ))}
                {meal.items.length === 0 && <p className="text-sm text-brand-text-secondary">No food logged yet.</p>}
            </div>
        </div>
    );
};

export default MealCard;
