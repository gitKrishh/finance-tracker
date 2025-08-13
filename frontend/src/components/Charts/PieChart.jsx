import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';

// Define a set of colors for the pie chart slices
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

const PieChartComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/transactions/summary/categories`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                // Recharts expects the 'value' key for the pie chart data
                const formattedData = response.data.data.map(item => ({
                    name: item.category,
                    value: item.totalAmount
                }));
                setData(formattedData);
            } catch (err) {
                console.error("Failed to fetch pie chart data:", err);
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
        return <div className="h-64 flex items-center justify-center text-gray-400">No expense data available.</div>;
    }

    return (
        // ResponsiveContainer makes the chart adapt to the size of its parent container
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartComponent;
