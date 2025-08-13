import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createTransaction,
    getUserTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
    getCategoryBreakdown,
} from "../controllers/transaction.controller.js";

const router = Router();

// Apply the 'auth' middleware to all routes in this file.
router.use(auth);

// --- Dashboard Routes ---
router.route("/stats").get(getTransactionStats);
router.route("/summary/categories").get(getCategoryBreakdown);

// --- Transaction CRUD Routes ---

// Route to create a new transaction (with optional receipt) and get all transactions
router.route("/")
    .post(
        upload.single("receipt"), // Multer middleware to process one file from the 'receipt' field
        createTransaction
    )
    .get(getUserTransactions);

// Route to get, update, and delete a specific transaction by its ID
router.route("/:id")
    .get(getTransactionById)
    .patch(updateTransaction)
    .delete(deleteTransaction);

export default router;
