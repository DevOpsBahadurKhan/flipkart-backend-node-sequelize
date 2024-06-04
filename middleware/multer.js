const multer = require('multer');
const path = require('path');

// Define storage
const storage = multer.memoryStorage();

// Define file filter
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|avi|mov/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png)!'));
    }
};

// Define upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: { fileSize: 1024 * 1024 * 100 } // 100MB file size limit
});

module.exports = upload;
