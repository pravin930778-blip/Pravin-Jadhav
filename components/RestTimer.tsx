import React, { useState, useEffect } from 'react';

interface RestTimerProps {
    duration: number;
    onFinish: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ duration, onFinish }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const progress = (timeLeft / duration) * 100;

    useEffect(() => {
        if (timeLeft <= 0) {
            onFinish();
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onFinish]);
    
    const radius = 24;
    const stroke = 4;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="bg-brand-surface p-3 rounded-xl flex items-center justify-between animate-fadeInUp">
            <div className="flex items-center space-x-3">
                 <div className="relative">
                    <svg height={radius * 2} width={radius * 2}>
                        <circle
                            stroke="#555"
                            fill="transparent"
                            strokeWidth={stroke}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        <circle
                            stroke="#F97316"
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeDasharray={circumference + ' ' + circumference}
                            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
                            strokeLinecap="round"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            transform={`rotate(-90 ${radius} ${radius})`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-white">Rest Timer</p>
                    <p className="text-sm text-brand-text-secondary">Take a break before your next set.</p>
                </div>
            </div>
            <div className="text-2xl font-bold text-white pr-2">
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                {String(timeLeft % 60).padStart(2, '0')}
            </div>
        </div>
    );
};

export default RestTimer;