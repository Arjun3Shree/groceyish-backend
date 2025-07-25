import multer from "multer";
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5*1024*1024 // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

export default upload;