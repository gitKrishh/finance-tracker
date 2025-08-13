import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Plus, Edit, Trash2 } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [initialType, setInitialType] = useState('expense');
    const { token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.openModal) {
            setInitialType(location.state.type || 'expense');
            setIsModalOpen(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, []);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/transactions`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            // --- THE DEFINITIVE SORTING FIX ---
            const sorted = response.data.data.sort((a, b) => {
                const dateComparison = new Date(b.date) - new Date(a.date);
                // If the main dates are different, sort by them.
                if (dateComparison !== 0) {
                    return dateComparison;
                }
                // If the main dates are the same, sort by the creation timestamp (newest first).
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setTransactions(sorted);

        } catch (err) {
            setError('Failed to fetch transactions.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/transactions/${id}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                fetchTransactions();
            } catch (err) {
                alert('Failed to delete transaction.');
            }
        }
    };

    const handleEdit = (transaction) => {
        setTransactionToEdit(transaction);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setTransactionToEdit(null);
        setInitialType('expense');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTransactionToEdit(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">All Transactions</h1>
                <button 
                    onClick={handleAdd}
                    className="flex items-center bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Transaction
                </button>
            </div>

            {isModalOpen && (
                <TransactionForm 
                    transactionToEdit={transactionToEdit}
                    onClose={handleCloseModal}
                    onSuccess={fetchTransactions}
                    initialType={initialType}
                />
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {loading && <li className="p-4 text-center">Loading...</li>}
                    {error && <li className="p-4 text-center text-red-500">{error}</li>}
                    {!loading && transactions.length === 0 && <li className="p-4 text-center text-gray-500">No transactions found.</li>}
                    
                    {transactions.map(tx => (
                        <li key={tx._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50">
                            <div className="flex items-center mb-2 sm:mb-0">
                                <div className={`w-3 h-12 rounded-full mr-4 ${tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div>
                                    <p className="font-bold text-gray-800">{tx.description}</p>
                                    <p className="text-sm text-gray-500">{tx.category} &middot; {format(new Date(tx.date), 'MMMM d, yyyy')}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 self-end sm:self-center">
                                <p className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'income' ? '+' : '-'}
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                                </p>
                                <button onClick={() => handleEdit(tx)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-200 rounded-full"><Edit className="h-5 w-5" /></button>
                                <button onClick={() => handleDelete(tx._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded-full"><Trash2 className="h-5 w-5" /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Transactions;
