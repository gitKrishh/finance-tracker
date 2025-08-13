import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

// Import the new chart components
import PieChartComponent from '../components/Charts/PieChart';
import BarChartComponent from '../components/Charts/BarChart';

// Reusable summary card component (no changes needed here)
const CardSummary = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
            </p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/transactions/stats`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setStats(response.data.data);
            } catch (err) {
                setError('Could not fetch financial stats.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    if (loading) {
        return <div className="text-center p-10">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-10">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Financial Overview</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardSummary 
                    title="Total Income" 
                    value={stats.totalIncome} 
                    icon={<TrendingUp className="h-6 w-6 text-green-700"/>}
                    color="bg-green-100"
                />
                <CardSummary 
                    title="Total Expense" 
                    value={stats.totalExpense} 
                    icon={<TrendingDown className="h-6 w-6 text-red-700"/>}
                    color="bg-red-100"
                />
                <CardSummary 
                    title="Balance" 
                    value={stats.balance} 
                    icon={<Wallet className="h-6 w-6 text-blue-700"/>}
                    color="bg-blue-100"
                />
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
                    <PieChartComponent />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <BarChartComponent />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
