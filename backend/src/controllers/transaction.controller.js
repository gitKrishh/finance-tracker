import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// --- All your existing controller functions (create, get, update, delete, stats, etc.) remain here ---
const createTransaction = asyncHandler(async (req, res) => {
    const { description, amount, type, category, date } = req.body;
    let receiptUrl = "";
    if (req.file) {
        const receiptLocalPath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(receiptLocalPath);
        if (!cloudinaryResponse) {
            throw new ApiError(500, "Error while uploading receipt");
        }
        receiptUrl = cloudinaryResponse.secure_url;
    }
    const transaction = await Transaction.create({ description, amount, type, category, date: date || new Date(), user: req.user._id, receiptUrl });
    return res.status(201).json(new ApiResponse(201, transaction, "Transaction created successfully"));
});
const getUserTransactions = asyncHandler(async (req, res) => {
    const { type, period } = req.query;
    const matchQuery = { user: req.user._id };
    if (type && ['income', 'expense'].includes(type)) {
        matchQuery.type = type;
    }
    if (period) {
        const now = new Date();
        let startDate;
        if (period.endsWith('d')) {
            const days = parseInt(period.slice(0, -1), 10);
            startDate = new Date(now.setDate(now.getDate() - days));
        }
        if (startDate) {
            matchQuery.date = { $gte: startDate };
        }
    }
    const transactions = await Transaction.find(matchQuery).sort({ date: -1 });
    return res.status(200).json(new ApiResponse(200, transactions, "Transactions retrieved successfully"));
});
const getTransactionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid transaction ID format");
    }
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
        throw new ApiError(404, "Transaction not found");
    }
    return res.status(200).json(new ApiResponse(200, transaction, "Transaction retrieved successfully"));
});
const updateTransaction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { description, amount, type, category, date } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid transaction ID format");
    }
    const originalTransaction = await Transaction.findById(id);
    if (!originalTransaction || originalTransaction.user.toString() !== req.user._id.toString()) {
        throw new ApiError(404, "Transaction not found or you do not have permission to update it");
    }
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, { $set: { description, amount, type, category, date } }, { new: true, runValidators: true });
    return res.status(200).json(new ApiResponse(200, updatedTransaction, "Transaction updated successfully"));
});
const deleteTransaction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid transaction ID format");
    }
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
        throw new ApiError(404, "Transaction not found or you do not have permission to delete it");
    }
    await Transaction.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse(200, { id }, "Transaction deleted successfully"));
});
const getTransactionStats = asyncHandler(async (req, res) => {
    const stats = await Transaction.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } }
    ]);
    let totalIncome = 0, totalExpense = 0;
    stats.forEach(stat => {
        if (stat._id === 'income') totalIncome = stat.totalAmount;
        else if (stat._id === 'expense') totalExpense = stat.totalAmount;
    });
    const balance = totalIncome - totalExpense;
    const summary = { totalIncome, totalExpense, balance };
    return res.status(200).json(new ApiResponse(200, summary, "Transaction stats retrieved successfully"));
});
const getCategoryBreakdown = asyncHandler(async (req, res) => {
    const breakdown = await Transaction.aggregate([
        { $match: { user: req.user._id, type: "expense" } },
        { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
        { $project: { _id: 0, category: "$_id", totalAmount: "$totalAmount" } },
        { $sort: { totalAmount: -1 } }
    ]);
    return res.status(200).json(new ApiResponse(200, breakdown, "Category breakdown retrieved successfully"));
});


// --- NEW FUNCTION for Reports Page ---
/**
 * @description Get comprehensive report data for a specified date range.
 * @query {string} startDate - The start date in YYYY-MM-DD format.
 * @query {string} endDate - The end date in YYYY-MM-DD format.
 */
const getReportData = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        throw new ApiError(400, "Start date and end date are required.");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end day

    const matchQuery = {
        user: req.user._id,
        date: { $gte: start, $lte: end }
    };

    // --- Perform multiple aggregations in parallel for efficiency ---
    const [trendData, categoryData, summaryData] = await Promise.all([
        // 1. Trend data for the line chart (Income vs Expense over time)
        Transaction.aggregate([
            { $match: matchQuery },
            { $sort: { date: 1 } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                    totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
                }
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, date: "$_id", income: "$totalIncome", expense: "$totalExpense" } }
        ]),
        // 2. Category breakdown for the details table
        Transaction.aggregate([
            { $match: { ...matchQuery, type: 'expense' } },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $project: { _id: 0, category: "$_id", amount: "$totalAmount", count: "$count" } }
        ]),
        // 3. Overall summary for the cards
        Transaction.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                    totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
                    totalTransactions: { $sum: 1 }
                }
            }
        ])
    ]);
    
    // Format the final response object
    const report = {
        trend: trendData,
        byCategory: categoryData,
        summary: summaryData[0] || { totalIncome: 0, totalExpense: 0, totalTransactions: 0 }
    };

    return res.status(200).json(new ApiResponse(200, report, "Report data retrieved successfully"));
});

export {
    createTransaction,
    getUserTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
    getCategoryBreakdown,
    getReportData // Export the new function
};
