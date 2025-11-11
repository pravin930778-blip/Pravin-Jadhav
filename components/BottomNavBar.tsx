import React from 'react';
import { View } from '../types';

interface BottomNavBarProps {
    currentView: View;
    setView: (view: View) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setView }) => {
    
    const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
        { view: 'dashboard', label: 'Home', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
        { view: 'diet', label: 'Diet', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
        { view: 'workout', label: 'Workout', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> },
        { view: 'analytics', label: 'Analytics', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> },
        { view: 'logbook', label: 'Logbook', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 2v4M17 2v4"></path></svg> },
    ];

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-brand-surface-light/80 backdrop-blur-lg border-t border-white/10 z-50">
            <div className="flex justify-around items-center h-20">
                {navItems.map(item => {
                    const isActive = currentView === item.view;
                    if(item.view === 'workout') {
                        return (
                             <button key={item.view} onClick={() => setView(item.view)} className="relative -top-6 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-brand-primary text-white shadow-lg shadow-brand-primary/30">
                                {item.icon}
                            </button>
                        )
                    }
                    return (
                        <button key={item.view} onClick={() => setView(item.view)} className={`flex flex-col items-center space-y-1 ${isActive ? 'text-brand-primary' : 'text-brand-text-secondary'} transition-colors`}>
                            {item.icon}
                            <span className="text-xs">{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </nav>
    );
};

export default BottomNavBar;