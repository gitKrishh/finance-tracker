import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Configure CORS middleware
// This allows your frontend (running on a different origin) to make requests to this backend.
app.use(cors({
    origin: process.env.CORS_ORIGIN, // The URL of your frontend application
    credentials: true,
}));

// Configure middleware to parse incoming request bodies
app.use(express.json({ limit: "16kb" })); // Parse JSON bodies, with a size limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parse URL-encoded bodies

// Configure middleware to serve static files (e.g., uploaded receipts if stored locally)
app.use(express.static("public"));

// Configure middleware to parse cookies from incoming requests
app.use(cookieParser());


// --- Routes Import ---
// Import your router files here. As your application grows, you'll add more routers.
import userRouter from './routes/user.routes.js';
import transactionRouter from './routes/transaction.routes.js';


// --- Routes Declaration ---
// Define the base path for your API routes.
// For example, any route defined in userRouter will be prefixed with /api/v1/users
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);


// --- Health Check Route ---
// A simple route to verify that the server is running.
app.get("/api/v1/healthcheck", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is healthy and running."
    });
});


// Export the configured Express app to be used in your main index.js file
export { app };