// Use require for dotenv at the very top to ensure environment variables are loaded before any other code runs.
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js';

// Configure dotenv to load variables from your .env file
dotenv.config({
    path: './.env' 
});

// Call the function to connect to the database.
// This returns a promise, so we use .then() and .catch() to handle the result.
connectDB()
.then(() => {
    // This listener catches any errors that the Express app might encounter before the server starts.
    app.on("error", (error) => {
        console.error("Express App Error: ", error);
        throw error;
    });

    // Start the server and make it listen on the port specified in the environment variables, or port 8000 as a fallback.
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`✅ Server is running at port : ${port}`);
    });
})
.catch((err) => {
    // If the database connection fails, log the error and exit the process.
    console.error("MONGO DB connection failed !!! ", err);
    process.exit(1);
});

