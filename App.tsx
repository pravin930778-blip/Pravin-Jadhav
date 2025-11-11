import React, { useState, useEffect } from 'react';
import { View } from './types';
import Dashboard from './components/Dashboard';
import DietScreen from './components/DietScreen';
import LogbookScreen from './components/LogbookScreen';
import TipsScreen from './components/TipsScreen';
import BottomNavBar from './components/BottomNavBar';
import AnalyticsScreen from './components/AnalyticsScreen';
import AchievementsScreen from './components/AchievementsScreen';
import ProfileScreen from './components/ProfileScreen';
import WorkoutDashboard from './components/WorkoutDashboard';
import StartScreen from './components/StartScreen';
// Fix: Import PlansScreen to resolve 'Cannot find name' error.
import PlansScreen from './components/PlansScreen';
// Fix: Import firebase compat for User type and auth side effects
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './firebase';
import Logo from './components/Logo';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    // Fix: Use firebase.User type from compat library
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fix: Use v8/compat syntax for onAuthStateChanged
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
             <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
                 <Logo className="w-20 h-20 text-brand-primary animate-pulse" />
                 <p className="mt-4 text-brand-text-secondary">Loading ATHLOS...</p>
            </div>
        );
    }

    if (!user) {
        return <StartScreen />;
    }

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard setView={setView} />;
            case 'workout':
                return <WorkoutDashboard setView={setView} />;
            case 'diet':
                return <DietScreen />;
            case 'logbook':
                return <LogbookScreen />;
            case 'tips':
                return <TipsScreen />;
            case 'analytics':
                return <AnalyticsScreen />;
            case 'achievements':
                return <AchievementsScreen />;
            case 'profile':
                return <ProfileScreen />;
            case 'plans':
                return <PlansScreen />;
            default:
                return <Dashboard setView={setView} />;
        }
    };

    return (
        <div className="bg-black text-brand-text min-h-screen font-sans">
            <div className="max-w-md mx-auto bg-[#0E0E10] min-h-screen relative pb-20">
                <main className="h-full">
                    {renderView()}
                </main>
                <BottomNavBar currentView={view} setView={setView} />
            </div>
        </div>
    );
};

export default App;