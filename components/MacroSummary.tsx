import React from 'react';

interface MacroSummaryProps {
    protein: number;
    carbs: number;
    fat: number;
}

const MacroBar: React.FC<{ label: string; value: number; color: string; total: number }> = ({ label, value, color, total }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="flex-1 text-center">
            <p className="text-white font-bold">{value.toFixed(0)}g</p>
            <p className="text-brand-text-secondary text-xs mb-1">{label}</p>
            <div className="bg-gray-700 rounded-full h-1.5 w-full">
                <div className={`${color} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}

const MacroSummary: React.FC<MacroSummaryProps> = ({ protein, carbs, fat }) => {
    const totalMacros = protein + carbs + fat;

    return (
        <div className="bg-brand-surface p-4 rounded-2xl flex items-center justify-around space-x-4">
            <MacroBar label="Protein" value={protein} color="bg-blue-500" total={totalMacros}/>
            <MacroBar label="Carbs" value={carbs} color="bg-orange-500" total={totalMacros}/>
            <MacroBar label="Fat" value={fat} color="bg-yellow-500" total={totalMacros}/>
        </div>
    );
};

export default MacroSummary;
