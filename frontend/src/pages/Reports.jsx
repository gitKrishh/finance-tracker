import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, List } from 'lucide-react';

// Reusable summary card component
const ReportCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border border-gray-200">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">
                {typeof value === 'number' && !isNaN(value)
                    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
                    : value
                }
            </p>
        </div>
    </div>
);

const Reports = () => {
    const { token } = useAuth();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Default date range to the last 30 days
    const [dateRange, setDateRange] = useState({
        startDate: format(subDays(new Date(), 29), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const fetchReportData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/transactions/reports`,
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: dateRange,
                }
            );
            setReportData(response.data.data);
        } catch (err) {
            setError('Failed to fetch report data. Please try a different date range.');
            setReportData(null);
        } finally {
            setLoading(false);
        }
    }, [token, dateRange]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    const handleDateChange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    };

    const totalExpenseForPercentage = reportData?.summary?.totalExpense || 0;

    return (
        <div className="space-y-8">
            {/* --- Header and Date Filter --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200">
                    <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} className="p-2 border rounded-md"/>
                    <span className="font-semibold text-gray-500">to</span>
                    <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} className="p-2 border rounded-md"/>
                    <button onClick={fetchReportData} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
                    </button>
                </div>
            </div>

            {loading && <div className="text-center p-10"><Loader2 size={48} className="animate-spin mx-auto text-blue-600"/></div>}
            {error && <div className="text-center p-10 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            {reportData && !loading && (
                <div className="space-y-8">
                    {/* --- Summary Cards --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ReportCard title="Total Income" value={reportData.summary.totalIncome} icon={<TrendingUp />} />
                        <ReportCard title="Total Expense" value={reportData.summary.totalExpense} icon={<TrendingDown />} />
                        <ReportCard title="Total Transactions" value={reportData.summary.totalTransactions} icon={<List />} />
                    </div>

                    {/* --- Trend Chart --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Income vs. Expense Trend</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={reportData.trend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
                                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* --- Category Breakdown Table --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Spending by Category</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="p-4 font-semibold text-gray-600">Category</th>
                                        <th className="p-4 font-semibold text-gray-600 text-right">Amount</th>
                                        <th className="p-4 font-semibold text-gray-600 text-right">Transactions</th>
                                        <th className="p-4 font-semibold text-gray-600 text-right">% of Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.byCategory.map((item, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-800">{item.category}</td>
                                            <td className="p-4 text-right text-gray-700">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount)}</td>
                                            <td className="p-4 text-right text-gray-700">{item.count}</td>
                                            <td className="p-4 text-right text-gray-700">
                                                {totalExpenseForPercentage > 0 ? ((item.amount / totalExpenseForPercentage) * 100).toFixed(1) : 0}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
