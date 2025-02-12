const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration for file handling (Using memoryStorage so files are directly uploaded to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limiting file size to 5MB
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
})
// }).fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]);

// Uploading files to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',  // Automatically detects file type (image, video, pdf, etc.)
            },
            (error, result) => {
                if (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    reject(error);  // Reject the promise on error
                }
                resolve({  // Resolve the promise with the result
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        ).end(fileBuffer);  // Use `.end()` with fileBuffer when uploading from memory
    });
};

module.exports = { upload, uploadToCloudinary };
