import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Page & Layout Imports ---
import MainLayout from './components/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions'; // Import the new page
import Settings from './pages/Setting';
import Reports from './pages/Reports';
// Placeholders for future pages



const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* --- Public Routes --- */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* --- Protected Routes (wrapped in MainLayout) --- */}
                    <Route 
                        path="/dashboard" 
                        element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} 
                    />
                    <Route 
                        path="/transactions" 
                        element={<ProtectedRoute><MainLayout><Transactions /></MainLayout></ProtectedRoute>} 
                    />
                    <Route 
                        path="/reports" 
                        element={<ProtectedRoute><MainLayout><Reports /></MainLayout></ProtectedRoute>} 
                    />
                    <Route 
                        path="/settings" 
                        element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} 
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
