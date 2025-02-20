const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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

// Uploading files to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    reject(error); 
                }
                resolve({ 
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        ).end(fileBuffer); 
    });
};

module.exports = { upload, uploadToCloudinary };
