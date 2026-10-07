import multer from "multer";
import fs from "fs";
import path from "path";

export const multerStorage = (
    destination: string,
    allowdTypes: RegExp = /jpeg|jpg|png|webp/
) => {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },

        filename: (req, file, cb) => {
            const uniqeName =
                Date.now() * Math.floor(Math.random() * 1e9);

            const ext = path.extname(file.originalname);

            cb(null, `${uniqeName}${ext}`);
        },
    });

    const fileFormats = (
        req: Express.Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        if (allowdTypes.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("file type not allowd"));
        }
    };

    const uploader = multer({
        storage,
        limits: {
            fieldSize: 512000000,
        },
        fileFilter: fileFormats,
    });

    return uploader;
};