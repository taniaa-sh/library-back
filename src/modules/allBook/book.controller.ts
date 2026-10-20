import express from 'express';
import { BookService } from './book.service';
import uploadBook from '../../middlewares/uploadBook';

const router = express.Router();
const bookService = new BookService();

router.post(
    '/addBook',
    uploadBook.fields([
        { name: 'bookImage', maxCount: 1 },
        { name: 'bookVideo', maxCount: 1 },
        { name: 'bookPdf', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const title = req.body?.title?.trim();
            const author = req.body?.author?.trim();
            const genre = req.body?.genre?.trim();
            const bookPrimaryColor =
                req.body?.bookPrimaryColor?.trim();
            const description = req.body?.description?.trim();

            const totalNumberOfBooks = Number(
                req.body?.totalNumberOfBooks
            );

            const files = req.files as
                | {
                      [fieldname: string]: Express.Multer.File[];
                  }
                | undefined;

            const imageFile = files?.bookImage?.[0];
            const videoFile = files?.bookVideo?.[0];
            const pdfFile = files?.bookPdf?.[0];

            if (!title) {
                return res.status(400).json({
                    error: 'title is empty!',
                });
            }

            if (!author) {
                return res.status(400).json({
                    error: 'author is empty!',
                });
            }

            if (!genre) {
                return res.status(400).json({
                    error: 'genre is empty!',
                });
            }

            if (!imageFile || !videoFile || !pdfFile) {
                return res.status(400).json({
                    error: 'Book image, video and PDF are required!',
                });
            }

            if (!bookPrimaryColor) {
                return res.status(400).json({
                    error: 'bookPrimaryColor is empty!',
                });
            }

            if (
                req.body?.totalNumberOfBooks === undefined ||
                req.body?.totalNumberOfBooks === '' ||
                !Number.isInteger(totalNumberOfBooks) ||
                totalNumberOfBooks < 0
            ) {
                return res.status(400).json({
                    error: 'totalNumberOfBooks must be a non-negative integer!',
                });
            }

            if (!description) {
                return res.status(400).json({
                    error: 'description is empty!',
                });
            }

            // Save relative paths in MongoDB, not Base64 strings.
            const bookImage = `/uploads/books/${imageFile.filename}`;
            const bookVideo = `/uploads/books/${videoFile.filename}`;
            const bookPdf = `/uploads/books/${pdfFile.filename}`;

            const result = await bookService.addBook(
                title,
                author,
                genre,
                bookVideo,
                bookPrimaryColor,
                bookImage,
                totalNumberOfBooks,
                description,
                bookPdf
            );

            return res.status(201).json(result);
        } catch (err: any) {
            console.error('Add book error:', err);

            return res.status(err?.status || 500).json({
                message: 'Internal Server Error',
                error: err.message,
            });
        }
    }
);

router.get('/getAll', async (req, res) => {
    const result = await bookService.getAll();

    return res.json(result);
});

export default router;