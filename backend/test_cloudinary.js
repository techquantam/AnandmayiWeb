require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET + 'wrong' // intentionally wrong
});

cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", 
    function(error, result) {
        if (error) {
            console.error('Cloudinary Upload Error:', error);
        } else {
            console.log('Cloudinary Upload Success:', result.secure_url);
        }
        process.exit(0);
    }
);
