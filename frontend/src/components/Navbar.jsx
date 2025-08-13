import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import necessary icons from lucide-react
import { LayoutDashboard, LogOut, Settings, User, ArrowRightLeft, Menu, X } from 'lucide-react';

// A simple, clean SVG logo for a professional look
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#3B82F6"/>
        <path d="M10 10H16V13H13V16H16V19H13V22H10V10Z" fill="white"/>
        <path d="M19 10H22V22H19V10Z" fill="white"/>
    </svg>
);

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // A reusable NavItem component for consistent styling
    const NavItem = ({ to, icon, children }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
            }
            onClick={() => setMobileMenuOpen(false)} // Close mobile menu on navigation
        >
            {icon}
            <span>{children}</span>
        </NavLink>
    );

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* --- Logo and Desktop Navigation --- */}
                    <div className="flex items-center space-x-8">
                        <NavLink to="/dashboard" className="flex items-center space-x-2">
                            <Logo />
                            <span className="text-xl font-bold text-gray-800 hidden sm:block">FinanceTracker</span>
                        </NavLink>
                        <nav className="hidden md:flex items-center space-x-4">
                            <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />}>Dashboard</NavItem>
                            <NavItem to="/transactions" icon={<ArrowRightLeft size={20} />}>Transactions</NavItem>
                        </nav>
                    </div>

                    {/* --- User Dropdown (Desktop) --- */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <User className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-sm text-gray-700">{user?.fullName}</span>
                            </button>
                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-50 border border-gray-200"
                                    onMouseLeave={() => setDropdownOpen(false)}
                                >
                                    <NavLink to="/settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                                        <Settings className="mr-3 h-5 w-5 text-gray-500"/>
                                        Settings
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut className="mr-3 h-5 w-5 text-gray-500"/>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Mobile Menu Button --- */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu --- */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />}>Dashboard</NavItem>
                        <NavItem to="/transactions" icon={<ArrowRightLeft size={20} />}>Transactions</NavItem>
                    </nav>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-5">
                            <User className="h-8 w-8 text-gray-500"/>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{user?.fullName}</div>
                                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                             <NavLink to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                <Settings className="mr-3 h-6 w-6 text-gray-500"/>
                                Settings
                            </NavLink>
                            <button onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                <LogOut className="mr-3 h-6 w-6 text-gray-500"/>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
