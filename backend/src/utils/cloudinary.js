// src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
    const absolutePath = path.resolve(localFilePath);

    try {
        if (!fs.existsSync(absolutePath)) {
            console.error("❌ File not found:", absolutePath);
            return null;
        }

        console.log("☁ Uploading to Cloudinary from:", absolutePath);

        const result = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "auto",
            folder: "receipts"
        });

        console.log("✅ Uploaded to Cloudinary:", result.secure_url);

        fs.unlinkSync(absolutePath); // delete temp file
        return result;
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error.message);
        if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
        return null;
    }
};
