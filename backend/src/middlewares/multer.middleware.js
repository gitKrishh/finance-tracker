import multer from "multer";

// Configure Multer storage to save files to a temporary directory on the disk.
const storage = multer.diskStorage({
    /**
     * @description Sets the destination folder for uploaded files.
     * @param {object} req - The Express request object.
     * @param {object} file - The file object being uploaded.
     * @param {function} cb - The callback function to complete the destination setup.
     */
    destination: function (req, file, cb) {
        // All temporary files will be stored in the './public/temp' directory.
        // Make sure this directory exists.
        cb(null, "./public/temp");
    },
    /**
     * @description Determines the filename for the uploaded file.
     * @param {object} req - The Express request object.
     * @param {object} file - The file object being uploaded.
     * @param {function} cb - The callback function to complete the filename setup.
     */
    filename: function (req, file, cb) {
        // For simplicity, we'll keep the original filename.
        // In a production environment, you might want to add a unique prefix
        // to avoid filename conflicts (e.g., using Date.now() or a random string).
        cb(null, file.originalname);
    }
});

// Create the Multer upload instance with the configured storage.
export const upload = multer({ 
    storage, 
});
