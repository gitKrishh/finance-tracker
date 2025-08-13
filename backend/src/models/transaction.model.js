import mongoose, { Schema } from "mongoose";

// Define the schema for the Transaction model
const transactionSchema = new Schema(
    {
        // Reference to the User who owns this transaction. Crucial for data isolation.
        user: {
            type: Schema.Types.ObjectId,
            ref: "User", // This creates the link to the User model
            required: true,
            index: true, // Indexing this field improves query performance for fetching user-specific transactions
        },
        description: {
            type: String,
            required: [true, "Transaction description is required"],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, "Transaction amount is required"],
            min: [0.01, "Amount must be greater than zero"], // Ensures no zero or negative amounts are logged
        },
        type: {
            type: String,
            required: [true, "Transaction type is required"],
            enum: ["income", "expense"], // Restricts the value to one of these two options
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            // Example categories, but you can allow any string.
            // For a stricter approach, you could use an enum here as well.
            // enum: ["Food", "Transport", "Salary", "Entertainment", "Utilities", "Other"]
        },
        date: {
            type: Date,
            required: [true, "Transaction date is required"],
            default: Date.now, // Defaults to the current date and time if not provided
        },
        receiptUrl: {
            type: String, // To store the URL from Cloudinary
            trim: true,
            default: "", // Optional field, so it can be an empty string
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create and export the Transaction model
export const Transaction = mongoose.model("Transaction", transactionSchema);
