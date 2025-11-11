import React, { useState } from 'react';
import Logo from './Logo';
import { auth } from '../firebase';
// Fix: Auth functions are called on the auth object, so modular imports are not needed.

const StartScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthAction = async () => {
        setError('');
        setLoading(true);
        try {
            if (isLoginView) {
                // Fix: Use v8/compat syntax for signInWithEmailAndPassword
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                // Fix: Use v8/compat syntax for createUserWithEmailAndPassword
                await auth.createUserWithEmailAndPassword(email, password);
            }
        } catch (err: any) {
            // Provide more user-friendly error messages
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists.');
            } else {
                setError('An error occurred. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-brand-text overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-sm text-center z-10">
                <div className="mb-8 animate-fadeInUp">
                    <div className="inline-flex items-center justify-center bg-brand-surface p-4 rounded-3xl mb-5 shadow-glass border border-white/10 backdrop-blur-lg">
                        <Logo className="w-12 h-12 text-brand-primary" />
                    </div>
                    <h1 className="text-5xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(249, 115, 22, 0.5)' }}>ATHLOS</h1>
                    <p className="text-brand-text-secondary mt-2 text-lg">Unlock Your Peak Performance.</p>
                </div>

                <div className="space-y-4 animate-fadeInUp animation-delay-600">
                    <input 
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-brand-surface border border-transparent rounded-lg text-white placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-brand-surface border border-transparent rounded-lg text-white placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button 
                        onClick={handleAuthAction}
                        disabled={loading || !email || !password}
                        className="w-full text-white font-bold py-3 rounded-xl bg-brand-primary hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-brand-primary/20 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Sign Up')}
                    </button>
                    <p className="text-sm text-brand-text-secondary pt-2">
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-brand-primary-light font-semibold ml-1">
                            {isLoginView ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>

            <footer className="absolute bottom-4 text-center text-brand-text-secondary/50 text-xs z-10 animate-fadeInUp animation-delay-800">
                <p>A Project ATHLOS Prototype</p>
                <p>Designed for academic presentation.</p>
            </footer>
        </div>
    );
};

export default StartScreen;