import React from 'react';

interface ChartProps {
  labels: string[];
  data: number[];
}

const WorkoutFrequencyChart: React.FC<ChartProps> = ({ labels, data }) => {
    if (data.length === 0) return <div className="h-48" />;

    const maxVal = Math.max(...data);
    
    return (
        <div className="w-full h-48 flex items-end justify-around gap-2 px-4 mt-4 relative">
            {data.map((value, index) => {
                const height = maxVal > 0 ? (value / maxVal) * 100 : 0;
                const opacity = 40 + (height * 0.6); // from 40% to 100%
                return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end">
                        <div 
                            className="w-full rounded-t-lg bg-brand-primary transition-all duration-500"
                            style={{ height: `${height}%`, opacity: `${opacity}%` }}
                        ></div>
                        <span className="text-xs text-brand-text-secondary mt-2">{labels[index]}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default WorkoutFrequencyChart;
