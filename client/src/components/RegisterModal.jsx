import React, { useState } from 'react';
import api from '../api/axios';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setFieldErrors({
                ...fieldErrors,
                avatar: 'დაშვებულია მხოლოდ JPG, PNG და WebP ფორმატის სურათები.',
            });
            return;
        }

        setFieldErrors({ ...fieldErrors, avatar: '' });
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setGeneralError('');

        const errors = {};
        if (formData.username.trim().length < 3) {
            errors.username = 'მომხმარებლის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო.';
        }
        if (formData.password.length < 3) {
            errors.password = 'პაროლი უნდა იყოს მინიმუმ 3 სიმბოლო.';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'პაროლები არ ემთხვევა ერთმანეთს.';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);

        try {
             const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('confirmPassword', formData.confirmPassword);
            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            const response = await api.post('/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            onRegisterSuccess(response.data.user, response.data.token);
            onClose();
        } catch (err) {
             if (err.response && err.response.data) {
                const resData = err.response.data;
                if (resData.errors) {
                    setFieldErrors(resData.errors);
                } else if (resData.message) {
                    setGeneralError(resData.message);
                }
            } else {
                setGeneralError('დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 text-white p-8 rounded-xl w-full max-w-md relative shadow-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
                
                {/* დახურვის (X) ღილაკი */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                {/* ზოგადი შეცდომის ბანერი */}
                {generalError && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            placeholder="Min. 3 characters"
                        />
                        {fieldErrors.username && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.username}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            placeholder="name@example.com"
                        />
                        {fieldErrors.email && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            placeholder="Min. 3 characters"
                        />
                        {fieldErrors.password && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            placeholder="Repeat password"
                        />
                        {fieldErrors.confirmPassword && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Avatar Upload with Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Avatar (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                            {avatarPreview && (
                                <img 
                                    src={avatarPreview} 
                                    alt="Avatar Preview" 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
                                />
                            )}
                            <input 
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleAvatarChange}
                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
                            />
                        </div>
                        {fieldErrors.avatar && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.avatar}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded transition duration-200 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <button 
                        onClick={onSwitchToLogin} 
                        className="text-red-400 hover:underline font-medium"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
}