import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // Assuming you might have a constants file

/**
 * @description Establishes a connection to the MongoDB database.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the connection string from environment variables.
        // The connection string should include the database name.
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        // Log a success message to the console, including the host of the connected database.
        console.log(`\n ✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        // If an error occurs during connection, log the error and exit the application.
        console.error("MONGODB connection FAILED: ", error);
        process.exit(1); // Exit with a non-zero code to indicate failure.
    }
};

export default connectDB;
