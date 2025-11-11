import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
// Fix: signOut is called on the auth object, so modular import is not needed.

const ProfileScreen: React.FC = () => {
  const [restDuration, setRestDuration] = useState<number>(60);
  const durationOptions = [30, 60, 90, 120];
  const user = auth.currentUser;

  useEffect(() => {
    const savedDuration = localStorage.getItem('restTimerDuration');
    if (savedDuration) {
      setRestDuration(parseInt(savedDuration, 10));
    }
  }, []);

  const handleDurationChange = (duration: number) => {
    setRestDuration(duration);
    localStorage.setItem('restTimerDuration', duration.toString());
  };
  
  const handleLogout = () => {
      // Fix: Use v8/compat syntax for signOut
      auth.signOut().catch(error => console.error("Error signing out: ", error));
  };

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');


  return (
    <div className="p-4 space-y-6">
      <header className="flex flex-col items-center text-center pt-8">
        <div className="w-24 h-24 bg-brand-surface rounded-full border-2 border-brand-primary mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8-0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <h1 className="text-2xl font-bold text-white">{displayName}</h1>
        <p className="text-brand-text-secondary">{user?.email}</p>
      </header>

      <div className="grid grid-cols-3 gap-4 text-center bg-brand-surface p-4 rounded-2xl">
        <div>
          <p className="text-2xl font-bold text-white">128</p>
          <p className="text-sm text-brand-text-secondary">Workouts</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">72kg</p>
          <p className="text-sm text-brand-text-secondary">Weight</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">182cm</p>
          <p className="text-sm text-brand-text-secondary">Height</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="w-full text-left p-4 bg-brand-surface rounded-lg">
            <label className="text-white font-semibold">Rest Timer Duration</label>
            <div className="flex justify-around items-center mt-3">
                {durationOptions.map(option => (
                    <button
                        key={option}
                        onClick={() => handleDurationChange(option)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${restDuration === option ? 'bg-brand-primary text-white' : 'bg-brand-surface-light text-brand-text'}`}
                    >
                        {option}s
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full text-left p-4 bg-brand-surface rounded-lg flex justify-between items-center hover:bg-white/5 transition-colors">
            <span className="text-white">Edit Profile</span>
            <svg className="w-5 h-5 text-brand-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
        <button className="w-full text-left p-4 bg-brand-surface rounded-lg flex justify-between items-center hover:bg-white/5 transition-colors">
            <span className="text-white">Settings</span>
            <svg className="w-5 h-5 text-brand-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
         <button onClick={handleLogout} className="w-full text-left p-4 bg-brand-surface rounded-lg flex justify-between items-center hover:bg-white/5 transition-colors">
            <span className="text-red-500">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;