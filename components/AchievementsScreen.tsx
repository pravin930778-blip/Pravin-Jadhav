import React, { useState } from 'react';
import { ACHIEVEMENTS_DATA, STREAK_DATA } from '../constants';
import { AchievementCategory } from '../types';
import Badge from './achievements/Badge';

const AchievementsScreen: React.FC = () => {
    const [filter, setFilter] = useState<AchievementCategory>('All');
    const categories: AchievementCategory[] = ['All', 'Consistency', 'Strength', 'Community', 'Cardio'];

    const filteredAchievements = filter === 'All' ? ACHIEVEMENTS_DATA : ACHIEVEMENTS_DATA.filter(a => a.category === filter);

    const FilterButton: React.FC<{label: AchievementCategory}> = ({label}) => (
        <button
            onClick={() => setFilter(label)}
            className={`px-4 py-1.5 text-sm font-semibold transition-colors rounded-full ${filter === label ? 'text-brand-primary' : 'text-brand-text-secondary'}`}
        >
            {label}
            {filter === label && <div className="w-full h-0.5 bg-brand-primary rounded-full mt-1"></div>}
        </button>
    );
    
    const streakProgress = (STREAK_DATA.progress / STREAK_DATA.total) * 100;

    return (
        <div className="bg-[#1C1C1E] min-h-full text-brand-text p-4">
            <header className="flex items-center justify-between mb-6">
                <button className="p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                <h1 className="text-xl font-bold">Achievements</h1>
                <button className="p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg></button>
            </header>

            {/* Streak Challenge Card */}
            <div className="bg-black/50 p-4 rounded-2xl mb-6">
                <div className="flex justify-between items-baseline mb-1">
                    <h2 className="font-bold text-white">{STREAK_DATA.title}</h2>
                    <p className="text-sm text-brand-text-secondary">{STREAK_DATA.progress}/{STREAK_DATA.total} Days</p>
                </div>
                 <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${streakProgress}%` }}></div>
                </div>
                <p className="text-xs text-brand-text-secondary">{STREAK_DATA.description}</p>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-around mb-6 border-b border-gray-700">
                {categories.map(cat => <FilterButton key={cat} label={cat} />)}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                {filteredAchievements.map(ach => <Badge key={ach.id} achievement={ach} />)}
            </div>
        </div>
    );
};

export default AchievementsScreen;
