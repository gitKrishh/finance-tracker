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
    getReportData, // Import the new controller
} from "../controllers/transaction.controller.js";

const router = Router();

// Apply the 'auth' middleware to all routes in this file.
router.use(auth);

// --- New Reports Route ---
// GET /api/v1/transactions/reports?startDate=...&endDate=...
router.route("/reports").get(getReportData);

// --- Dashboard Routes ---
router.route("/stats").get(getTransactionStats);
router.route("/summary/categories").get(getCategoryBreakdown);

// --- Transaction CRUD Routes ---
router.route("/")
    .post(upload.single("receipt"), createTransaction)
    .get(getUserTransactions);

router.route("/:id")
    .get(getTransactionById)
    .patch(updateTransaction)
    .delete(deleteTransaction);

export default router;
