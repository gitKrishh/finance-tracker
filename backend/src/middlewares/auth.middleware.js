import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

/**
 * @description Middleware to verify JWT and attach user to the request object.
 */
export const auth = asyncHandler(async (req, _, next) => {
    try {
        // 1. Extract token from request
        // The token can be in the cookies or in the Authorization header (as "Bearer <token>")
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // 2. Check if token exists
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        // 3. Verify the token
        // This will throw an error if the token is invalid or expired
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 4. Find the user based on the decoded token's ID
        // Exclude the password and refreshToken fields for security
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // 5. Check if user exists in the database
        if (!user) {
            // This case handles a valid token for a user that has since been deleted.
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        // 6. Attach the user object to the request for use in subsequent middleware/controllers
        req.user = user;
        
        // 7. Pass control to the next middleware
        next();
    } catch (error) {
        // Catches errors from jwt.verify (e.g., TokenExpiredError, JsonWebTokenError)
        // and any other errors that might occur.
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});
