import React, { useState } from 'react';
import api from '../api/axios';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            
            onLoginSuccess(response.data.user, response.data.token);
            onClose();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('wrong email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 text-white p-8 rounded-xl w-full max-w-md relative shadow-2xl border border-gray-800">
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            placeholder="name@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="password" 
                            required
                            minLength={3}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            placeholder="Min. 3 characters"
                        />
                    </div>

                    {/* Log In Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded transition duration-200 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <button 
                        onClick={onSwitchToRegister} 
                        className="text-red-400 hover:underline font-medium"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}