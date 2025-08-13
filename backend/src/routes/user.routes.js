import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser 
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

// Create a new router instance
const router = Router();

// --- Public Routes ---
// These routes do not require authentication.

// Route for user registration
// POST /api/v1/users/register
router.route("/register").post(registerUser);

// Route for user login
// POST /api/v1/users/login
router.route("/login").post(loginUser);


// --- Secured Routes ---
// These routes require the user to be logged in (i.e., have a valid access token).

// Route for user logout
// POST /api/v1/users/logout
// The 'auth' middleware is applied here to ensure only an authenticated user can log out.
router.route("/logout").post(auth, logoutUser);


// Export the router to be used in app.js
export default router;
