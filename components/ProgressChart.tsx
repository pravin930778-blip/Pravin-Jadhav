import React from 'react';

interface ChartData {
  date: string;
  weight: number;
}

interface ProgressChartProps {
  exerciseName: string;
  data: ChartData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ exerciseName, data }) => {
  if (data.length < 2) {
    return (
      <div className="p-4 rounded-lg text-center h-[260px] flex flex-col justify-center">
        {/* Placeholder content removed as per user request */}
      </div>
    );
  }

  const svgWidth = 350;
  const svgHeight = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const maxWeight = Math.max(...data.map(d => d.weight));
  const minWeight = Math.min(...data.map(d => d.weight), 0);

  const getX = (index: number) => margin.left + (index / (data.length - 1)) * width;
  const getY = (weight: number) => {
      const range = maxWeight - minWeight;
      if (range === 0) return margin.top + height / 2;
      return margin.top + height - ((weight - minWeight) / range) * height;
  }

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.weight)}`).join(' ');

  return (
    <div className="p-4 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-4 text-center">{exerciseName} Progress</h3>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
        {/* Y Axis Labels */}
        <text x={margin.left - 8} y={getY(maxWeight) + 5} textAnchor="end" fill="#94A3B8" fontSize="10">{maxWeight} kg</text>
        <text x={margin.left - 8} y={getY(minWeight) + 5} textAnchor="end" fill="#94A3B8" fontSize="10">{minWeight} kg</text>
        
        {/* X Axis Labels */}
        <text x={getX(0)} y={svgHeight - 5} textAnchor="middle" fill="#94A3B8" fontSize="10">{new Date(data[0].date).toLocaleDateString('en-GB', {month: 'short', day: 'numeric'})}</text>
        <text x={getX(data.length - 1)} y={svgHeight - 5} textAnchor="middle" fill="#94A3B8" fontSize="10">{new Date(data[data.length - 1].date).toLocaleDateString('en-GB', {month: 'short', day: 'numeric'})}</text>

        {/* Grid Lines */}
        <line x1={margin.left} y1={getY(maxWeight)} x2={width + margin.left} y2={getY(maxWeight)} stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.5" />
        <line x1={margin.left} y1={getY(minWeight)} x2={width + margin.left} y2={getY(minWeight)} stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.5" />

        {/* Line Path */}
        <path d={linePath} fill="none" stroke="#F97316" strokeWidth="2" />
        
        {/* Data Points */}
        {data.map((d, i) => (
          <circle key={i} cx={getX(i)} cy={getY(d.weight)} r="3" fill="#F97316" />
        ))}
      </svg>
    </div>
  );
};

export default ProgressChart;