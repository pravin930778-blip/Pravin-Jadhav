import React from 'react';

interface ChartProps {
  labels: string[];
  data: number[];
}

const WeightOverTimeChart: React.FC<ChartProps> = ({ labels, data }) => {
  if (data.length === 0) return <div className="h-48" />;

  const svgWidth = 350;
  const svgHeight = 150;
  const maxVal = Math.max(...data);
  const minVal = 0;
  
  const getX = (index: number) => (index / (data.length - 1)) * svgWidth;
  const getY = (value: number) => svgHeight - (value / maxVal) * svgHeight;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d)}`).join(' ');
  const areaPath = `${linePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  
  const peakIndex = data.indexOf(Math.max(...data));

  return (
    <div className="w-full h-48 relative mt-4">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGradient)" />
            <path d={linePath} fill="none" stroke="#F97316" strokeWidth="2.5" />
             {/* Peak Circle */}
            <circle cx={getX(peakIndex)} cy={getY(data[peakIndex])} r="4" fill="white" />
            <circle cx={getX(peakIndex)} cy={getY(data[peakIndex])} r="2" fill="#F97316" />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {labels.map(label => (
                <span key={label} className="text-xs text-brand-text-secondary">{label}</span>
            ))}
        </div>
    </div>
  );
};

export default WeightOverTimeChart;
