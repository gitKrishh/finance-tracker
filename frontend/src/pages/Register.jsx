import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- SVG Icons for form fields ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/users/register`, 
                { fullName, email, password }
            );
            
            setSuccess("Registration successful! Redirecting to login...");
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Create Your Account</h1>
                    <p className="text-gray-600 mt-2">Start your journey to financial freedom.</p>
                </div>
            </div>
            <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-200 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">Full Name</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="John Doe"/>
                        </div>
                    </div>
                    {/* Email */}
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">Email Address</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><MailIcon /></span>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="you@example.com"/>
                        </div>
                    </div>
                    {/* Password */}
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">Password</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="••••••••"/>
                        </div>
                    </div>
                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">Confirm Password</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="••••••••"/>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>}
                    {success && <p className="text-sm text-green-500 bg-green-50 p-3 rounded-lg text-center">{success}</p>}

                    <div>
                        <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-bold text-lg transition duration-300 disabled:bg-blue-300">
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline font-semibold">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
