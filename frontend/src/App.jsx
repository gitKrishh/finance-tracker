import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';

// --- Page Imports ---
// You will create these page components next.
// For now, we can use placeholder components.
const Login = () => <h2>Login Page</h2>;
const Register = () => <h2>Register Page</h2>;
const Dashboard = () => <h2>Dashboard</h2>;
const Transactions = () => <h2>Transactions Page</h2>;
const Reports = () => <h2>Reports Page</h2>;
const Settings = () => <h2>Settings Page</h2>;


/**
 * @description A wrapper component to protect routes that require authentication.
 * If the user is not authenticated, it redirects them to the login page.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them back to their original page
        // after they log in.
        return <Navigate to="/login" replace />;
    }
    return children;
};


// Main App Component
function App() {
    return (
        <AuthProvider>
            <Router>
                {/* You can add a persistent Navbar or Sidebar component here */}
                <Routes>
                    {/* --- Public Routes --- */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* --- Protected Routes --- */}
                    <Route 
                        path="/dashboard" 
                        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/transactions" 
                        element={<ProtectedRoute><Transactions /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/reports" 
                        element={<ProtectedRoute><Reports /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/settings" 
                        element={<ProtectedRoute><Settings /></ProtectedRoute>} 
                    />

                    {/* --- Catch-all Route --- */}
                    {/* Redirects any unknown paths to the landing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

