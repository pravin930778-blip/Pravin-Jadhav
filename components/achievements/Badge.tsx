import React from 'react';
import { Achievement } from '../../types';

interface BadgeProps {
    achievement: Achievement;
}

const Badge: React.FC<BadgeProps> = ({ achievement }) => {
    const { title, description, unlocked, icon: Icon } = achievement;

    return (
        <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 border-2 ${unlocked ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-600 bg-gray-800/50'}`}>
                <Icon className={`w-12 h-12 ${unlocked ? 'text-brand-primary' : 'text-gray-500'}`} />
            </div>
            <p className={`font-bold ${unlocked ? 'text-white' : 'text-gray-400'}`}>{title}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
};

export default Badge;
