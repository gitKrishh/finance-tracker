import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// Import necessary icons from lucide-react
import { User, Lock, Mail, Loader2 } from 'lucide-react';

// Reusable form section component with enhanced styling
const FormSection = ({ title, icon, children }) => (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
                {icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
);

// Reusable input component with icon
const InputWithIcon = ({ id, type, value, onChange, placeholder, icon }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
        </div>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
        />
    </div>
);

const Settings = () => {
    const { user, token, login } = useAuth();

    // State for profile details form
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [profileLoading, setProfileLoading] = useState(false);

    // State for password change form
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' });
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/update-account`,
                { fullName, email },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            login(response.data.data, token);
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setProfileMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/users/change-password`,
                { oldPassword, newPassword },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* --- User Profile Header --- */}
            <div className="flex flex-col sm:flex-row items-center mb-8">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 sm:mb-0 sm:mr-6">
                    {user?.fullName?.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center sm:text-left">{user?.fullName}</h1>
                    <p className="text-gray-500 text-center sm:text-left">{user?.email}</p>
                </div>
            </div>

            {/* --- Main Content Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Profile Information Form --- */}
                <FormSection title="Profile Information" icon={<User className="h-6 w-6 text-blue-600" />}>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <InputWithIcon id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" icon={<User size={20} className="text-gray-400" />} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <InputWithIcon id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" icon={<Mail size={20} className="text-gray-400" />} />
                        </div>
                        {profileMessage.text && (
                            <p className={`text-sm font-medium p-3 rounded-lg ${profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{profileMessage.text}</p>
                        )}
                        <div className="text-right pt-2">
                            <button type="submit" disabled={profileLoading} className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200">
                                {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {profileLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </FormSection>

                {/* --- Change Password Form --- */}
                <FormSection title="Change Password" icon={<Lock className="h-6 w-6 text-blue-600" />}>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                            <InputWithIcon id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••••" icon={<Lock size={20} className="text-gray-400" />} />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <InputWithIcon id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" icon={<Lock size={20} className="text-gray-400" />} />
                        </div>
                        {passwordMessage.text && (
                            <p className={`text-sm font-medium p-3 rounded-lg ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{passwordMessage.text}</p>
                        )}
                        <div className="text-right pt-2">
                            <button type="submit" disabled={passwordLoading} className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200">
                                {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {passwordLoading ? 'Saving...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </FormSection>
            </div>
        </div>
    );
};

export default Settings;
