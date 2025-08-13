import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

/**
 * @description Generates access and refresh tokens, saves the refresh token to the user, and returns them.
 * @param {mongoose.Document} user - The user document for whom to generate tokens.
 * @returns {object} An object containing the accessToken and refreshToken.
 */
const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token to the user document in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // Avoids running password validation again

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

/**
 * @description Handles user registration.
 */
const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from request body
    const { fullName, email, password } = req.body;

    // 2. Validate that required fields are not empty
    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // 4. Create a new user object in the database
    const user = await User.create({
        fullName,
        email,
        password,
    });

    // 5. Retrieve the created user (without password and refresh token)
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // 6. Check if user was created successfully
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 7. Return a success response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

/**
 * @description Handles user login.
 */
const loginUser = asyncHandler(async (req, res) => {
    // 1. Get user credentials from request body
    const { email, password } = req.body;

    // 2. Validate that email and password are provided
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // 3. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // 4. Check if the provided password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // 5. Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    // 6. Retrieve the logged-in user details (without sensitive fields)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // 7. Set cookies with tokens
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

/**
 * @description Handles user logout.
 */
const logoutUser = asyncHandler(async (req, res) => {
    // The auth middleware adds the user to the request object (req.user)
    // We remove the refresh token from their document in the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }, // Removes the refreshToken field
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    // Clear the cookies from the client's browser
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});


export {
    registerUser,
    loginUser,
    logoutUser,
};
