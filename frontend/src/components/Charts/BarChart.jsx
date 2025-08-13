import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const BarChartComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/transactions`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                // Process the last 5 transactions for the chart
                const recentTransactions = response.data.data.slice(0, 5).map(tx => ({
                    name: format(new Date(tx.date), 'MMM d'), // Format date like "Aug 13"
                    income: tx.type === 'income' ? tx.amount : 0,
                    expense: tx.type === 'expense' ? tx.amount : 0,
                })).reverse(); // Reverse to show oldest first
                setData(recentTransactions);
            } catch (err) {
                console.error("Failed to fetch bar chart data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    if (loading) {
        return <div className="h-64 flex items-center justify-center text-gray-400">Loading Chart...</div>;
    }

    if (data.length === 0) {
        return <div className="h-64 flex items-center justify-center text-gray-400">No recent transactions to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)} />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" />
                <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;
