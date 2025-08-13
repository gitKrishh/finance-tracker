// src/utils/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Node.js File System module

// Configure Cloudinary with credentials from environment variables.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @description Uploads a file from a local path to Cloudinary.
 * @param {string} localFilePath - The path to the local file to upload.
 * @returns {object | null} The Cloudinary response object on success, or null on failure.
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Check if the local file path is provided.
        if (!localFilePath) {
            console.error("Cloudinary Error: Local file path is missing.");
            return null;
        }

        // Upload the file to Cloudinary.
        // `resource_type: "auto"` automatically detects the file type (image, video, etc.).
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        
        // File has been uploaded successfully.
        // console.log("File is uploaded on Cloudinary: ", response.url);
        
        // Remove the locally saved temporary file.
        fs.unlinkSync(localFilePath);
        
        return response;

    } catch (error) {
        // If the upload fails, remove the locally saved temporary file.
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary Upload Error: ", error);
        return null;
    }
};

export { uploadOnCloudinary };