import React from 'react';

interface CalorieSummaryProps {
    calories: number;
    goal: number;
}

const CalorieSummary: React.FC<CalorieSummaryProps> = ({ calories, goal }) => {
    const progress = Math.min((calories / goal) * 100, 100);

    return (
        <div className="bg-brand-surface p-4 rounded-2xl flex items-center justify-between">
            <div>
                <p className="text-brand-text-secondary text-sm">Calories</p>
                <p className="text-2xl font-bold text-white">{calories.toFixed(0)} <span className="text-base font-normal text-brand-text-secondary">/ {goal} kcal</span></p>
            </div>
            <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#333"
                        strokeWidth="3"
                    />
                    <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#F97316"
                        strokeWidth="3"
                        strokeDasharray={`${progress}, 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                    />
                </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{progress.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    );
};

export default CalorieSummary;
