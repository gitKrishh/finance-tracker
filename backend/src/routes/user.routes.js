import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser,
    updateAccountDetails,
    changeCurrentPassword,
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// --- Public Routes ---
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// --- Secured Routes ---
router.route("/logout").post(auth, logoutUser);

// New route to update account details
router.route("/update-account").patch(auth, updateAccountDetails);

// New route to change password
router.route("/change-password").post(auth, changeCurrentPassword);

// Note: The avatar route is defined but the controller isn't fully implemented yet.
// You can add the updateUserAvatar controller later.
router.route("/avatar").patch(auth, upload.single("avatar"), (req, res) => {
    res.status(200).json(new ApiResponse(200, {}, "Avatar update endpoint placeholder"));
});

export default router;
