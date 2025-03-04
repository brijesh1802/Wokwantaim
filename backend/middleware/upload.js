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
        if (['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
})

const deleteFromCloudinary = (public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.error('Error deleting from Cloudinary:', error);
                reject(error);
            }
            resolve(result);
        });
    });
}


const uploadToCloudinary = (fileBuffer, folder, fileType) => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: folder,
            resource_type: 'auto',
        };

        // if (fileType === 'image') {
        //     uploadOptions.transformation = [{
        //         quality: 'auto',
        //         format: 'webp'
        //     }];
        // }

        cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    console.error('Upload options:', uploadOptions);
                    console.error('File type:', fileType);
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


module.exports = { upload, uploadToCloudinary, deleteFromCloudinary};
