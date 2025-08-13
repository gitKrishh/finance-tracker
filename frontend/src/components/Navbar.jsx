import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, Settings, User } from 'lucide-react';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center space-x-2">
                    <LayoutDashboard className="h-6 w-6 text-blue-500" />
                    <span className="text-xl font-bold text-gray-800">Dashboard</span>
                </Link>

                <div className="relative">
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                    >
                        <span className="font-semibold text-gray-700 hidden sm:block">{user?.fullName}</span>
                        <User className="h-6 w-6 text-gray-600" />
                    </button>

                    {dropdownOpen && (
                        <div 
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10"
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
                                <Settings className="mr-3 h-5 w-5"/>
                                Settings
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                            >
                                <LogOut className="mr-3 h-5 w-5"/>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
