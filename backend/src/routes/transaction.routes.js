import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // Import Multer middleware
import {
    createTransaction,
    getUserTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
    getCategoryBreakdown,
    addReceiptToTransaction, // Import the new controller
} from "../controllers/transaction.controller.js";

const router = Router();

// Apply the 'auth' middleware to all routes in this file.
router.use(auth);

// --- Dashboard Routes ---
router.route("/stats").get(getTransactionStats);
router.route("/summary/categories").get(getCategoryBreakdown);

// --- Transaction CRUD Routes ---
router.route("/")
    .post(createTransaction)
    .get(getUserTransactions);

router.route("/:id")
    .get(getTransactionById)
    .patch(updateTransaction)
    .delete(deleteTransaction);

// --- NEW Route for Receipt Upload ---
// This route will handle uploading a receipt for a specific transaction.
// PATCH /api/v1/transactions/:id/receipt
router.route("/:id/receipt").patch(
    upload.single("receipt"), // Multer middleware to process one file from the 'receipt' field
    addReceiptToTransaction
);

export default router;
