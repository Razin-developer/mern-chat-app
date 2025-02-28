import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
// ✅ Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ✅ Ensure correct absolute path
const uploadDirectory = path.resolve(__dirname, '../../../frontend/dist/images/messages');
console.log("✅ Upload directory:", uploadDirectory);
// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
// File Filter (Optional)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'));
    }
};
// Multer Middleware
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
export default upload;
