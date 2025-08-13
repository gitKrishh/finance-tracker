import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- SVG Icons for form fields ---
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


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from our context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Manually making the API call with axios
            const response = await axios.post(
                // Ensure you have VITE_API_URL in your .env file
                `${import.meta.env.VITE_API_URL}/users/login`, 
                { email, password },
                { withCredentials: true } // Important for sending cookies
            );
            
            // On success, call the login function from the context
            const { user, accessToken } = response.data.data;
            login(user, accessToken);

            // Redirect to the dashboard
            navigate('/dashboard');

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>
                    <p className="text-gray-600 mt-2">Log in to manage your finances.</p>
                </div>
            </div>
            <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-200 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block">Email Address</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <MailIcon />
                            </span>
                            <input 
                                id="email" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required 
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-600 block">Password</label>
                         <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockIcon />
                            </span>
                            <input 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required 
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>}

                    {/* Submit Button */}
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-bold text-lg transition duration-300 disabled:bg-blue-300"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline font-semibold">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
