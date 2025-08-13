import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * A form component for creating or editing a transaction.
 * @param {object} props
 * @param {object|null} props.transactionToEdit - The transaction object to edit, or null for a new transaction.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onSuccess - Function to call after a successful submission to refresh the transaction list.
 */
const TransactionForm = ({ transactionToEdit, onClose, onSuccess }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    // If we are editing, populate the form fields when the component mounts
    useEffect(() => {
        if (transactionToEdit) {
            setDescription(transactionToEdit.description);
            setAmount(transactionToEdit.amount);
            setType(transactionToEdit.type);
            setCategory(transactionToEdit.category);
            setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
        }
    }, [transactionToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const transactionData = { description, amount: parseFloat(amount), type, category, date };
        
        try {
            if (transactionToEdit) {
                // Update existing transaction
                await axios.patch(
                    `${import.meta.env.VITE_API_URL}/transactions/${transactionToEdit._id}`,
                    transactionData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            } else {
                // Create new transaction
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/transactions`,
                    transactionData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            }
            onSuccess(); // Refresh the list
            onClose();   // Close the modal
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-600">Description</label>
                        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-600">Amount</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required placeholder="0.00" />
                    </div>
                    {/* Type */}
                    <div className="flex space-x-4">
                        <label className="flex-1">
                            <input type="radio" value="expense" checked={type === 'expense'} onChange={(e) => setType(e.target.value)} className="sr-only peer" />
                            <div className="w-full p-3 text-center rounded-lg cursor-pointer peer-checked:bg-red-500 peer-checked:text-white bg-gray-100 text-gray-700">Expense</div>
                        </label>
                        <label className="flex-1">
                            <input type="radio" value="income" checked={type === 'income'} onChange={(e) => setType(e.target.value)} className="sr-only peer" />
                            <div className="w-full p-3 text-center rounded-lg cursor-pointer peer-checked:bg-green-500 peer-checked:text-white bg-gray-100 text-gray-700">Income</div>
                        </label>
                    </div>
                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-600">Category</label>
                        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required placeholder="e.g., Food, Salary" />
                    </div>
                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-600">Date</label>
                        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                            {loading ? 'Saving...' : 'Save Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
