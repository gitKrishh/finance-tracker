import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/**
 * @description Create a new financial transaction, optionally with a receipt.
 */
const createTransaction = asyncHandler(async (req, res) => {
    // 1. Get transaction details from the request body
    const { description, amount, type, category, date } = req.body;

    // 2. Validate that required fields are not empty
    if (!description || !amount || !type || !category) {
        throw new ApiError(400, "Description, amount, type, and category are required");
    }

    let receiptUrl = ""; // Default to an empty string

    // 3. Check if a receipt file was uploaded
    if (req.file) {
        const receiptLocalPath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(receiptLocalPath);

        if (!cloudinaryResponse) {
            throw new ApiError(500, "Error while uploading receipt to cloud service");
        }
        receiptUrl = cloudinaryResponse.secure_url;
    }

    // 4. Create the transaction in the database
    const transaction = await Transaction.create({
        description,
        amount,
        type,
        category,
        date: date || new Date(),
        user: req.user._id,
        receiptUrl: receiptUrl, // Add the Cloudinary URL
    });

    // 5. Return a success response with the created transaction data
    return res.status(201).json(
        new ApiResponse(201, transaction, "Transaction created successfully")
    );
});


// --- Other Controller Functions (getUserTransactions, getById, update, delete, etc.) ---

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
    return res.status(200).json(
        new ApiResponse(200, transactions, "Transactions retrieved successfully")
    );
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
    return res.status(200).json(
        new ApiResponse(200, transaction, "Transaction retrieved successfully")
    );
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
    const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { $set: { description, amount, type, category, date } },
        { new: true, runValidators: true }
    );
    return res.status(200).json(
        new ApiResponse(200, updatedTransaction, "Transaction updated successfully")
    );
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
    return res.status(200).json(
        new ApiResponse(200, { id }, "Transaction deleted successfully")
    );
});

const getTransactionStats = asyncHandler(async (req, res) => {
    const stats = await Transaction.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } }
    ]);
    let totalIncome = 0;
    let totalExpense = 0;
    stats.forEach(stat => {
        if (stat._id === 'income') totalIncome = stat.totalAmount;
        else if (stat._id === 'expense') totalExpense = stat.totalAmount;
    });
    const balance = totalIncome - totalExpense;
    const summary = { totalIncome, totalExpense, balance };
    return res.status(200).json(
        new ApiResponse(200, summary, "Transaction stats retrieved successfully")
    );
});

const getCategoryBreakdown = asyncHandler(async (req, res) => {
    const breakdown = await Transaction.aggregate([
        { $match: { user: req.user._id, type: "expense" } },
        { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
        { $project: { _id: 0, category: "$_id", totalAmount: "$totalAmount" } },
        { $sort: { totalAmount: -1 } }
    ]);
    return res.status(200).json(
        new ApiResponse(200, breakdown, "Category breakdown retrieved successfully")
    );
});


export {
    createTransaction,
    getUserTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
    getCategoryBreakdown,
};
