import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, Wallet, PlusCircle } from 'lucide-react';
import PieChartComponent from '../components/Charts/PieChart';

// Helper function for a personalized greeting
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

// Enhanced Summary Card Component
const CardSummary = ({ title, value, icon, color, bgColor }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-4 transition-transform transform hover:-translate-y-1`}>
        <div className={`p-3 rounded-full ${bgColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
            </p>
        </div>
    </div>
);

// Recent Transaction Item Component
const RecentTransactionItem = ({ tx }) => (
    <div className="flex justify-between items-center py-3">
        <div className="flex items-center">
            <div className={`w-2 h-10 rounded-full mr-4 ${tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
                <p className="font-semibold text-gray-800">{tx.description}</p>
                <p className="text-xs text-gray-500">{format(new Date(tx.date), 'MMM d, yyyy')}</p>
            </div>
        </div>
        <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {tx.type === 'income' ? '+' : '-'}
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
        </p>
    </div>
);


const Dashboard = () => {
    const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, transactionsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/transactions/stats`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    })
                ]);
                setStats(statsRes.data.data);

                // --- THE DEFINITIVE SORTING FIX ---
                // This robustly sorts transactions, handling cases where dates are identical.
                const sortedTransactions = transactionsRes.data.data.sort((a, b) => {
                    const dateComparison = new Date(b.date) - new Date(a.date);
                    // If the main transaction dates are different, sort by them.
                    if (dateComparison !== 0) {
                        return dateComparison;
                    }
                    // Otherwise, as a tie-breaker, sort by the creation timestamp (newest first).
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                
                setRecentTransactions(sortedTransactions.slice(0, 3));

            } catch (err) {
                setError('Could not fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) {
        return <div className="text-center p-10">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-10">{error}</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{getGreeting()}, {user?.fullName.split(' ')[0]}!</h1>
                <p className="text-gray-500 mt-1">Here's a look at your financial health today.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CardSummary title="Total Income" value={stats.totalIncome} icon={<TrendingUp className="h-6 w-6 text-green-700"/>} bgColor="bg-green-100" color="text-green-700" />
                        <CardSummary title="Total Expense" value={stats.totalExpense} icon={<TrendingDown className="h-6 w-6 text-red-700"/>} bgColor="bg-red-100" color="text-red-700" />
                        <CardSummary title="Balance" value={stats.balance} icon={<Wallet className="h-6 w-6 text-blue-700"/>} bgColor="bg-blue-100" color="text-blue-700" />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Expense Breakdown</h2>
                        <PieChartComponent />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link to="/transactions" state={{ openModal: true, type: 'expense' }} className="w-full flex items-center justify-center p-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
                                <PlusCircle size={20} className="mr-2"/> Add Expense
                            </Link>
                             <Link to="/transactions" state={{ openModal: true, type: 'income' }} className="w-full flex items-center justify-center p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
                                <PlusCircle size={20} className="mr-2"/> Add Income
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-2 text-gray-800">Recent Activity</h2>
                        <div className="divide-y divide-gray-200">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map(tx => <RecentTransactionItem key={tx._id} tx={tx} />)
                            ) : (
                                <p className="text-center text-gray-500 py-4">No recent transactions.</p>
                            )}
                        </div>
                         <Link to="/transactions" className="mt-4 block text-center text-sm font-semibold text-blue-600 hover:underline">View All Transactions</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
