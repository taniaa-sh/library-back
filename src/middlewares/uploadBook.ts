import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = path.join(
    process.cwd(),
    'public',
    'uploads',
    'books'
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname);

        const filename =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extension;

        callback(null, filename);
    },
});

const uploadBook = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});

export default uploadBook;