import express from 'express';
import { BookService } from './book.service';

const router = express.Router();
const bookService = new BookService();

router.post('/addBook', async (req, res) => {
    try {
        const title = req.body?.title?.trim() || undefined;
        const author = req.body?.author?.trim() || undefined;
        const genre = req.body?.genre?.trim() || undefined;
        const bookVideo = req.body?.bookVideo?.trim() || undefined;
        const bookPrimaryColor =
            req.body?.bookPrimaryColor?.trim() || undefined;
        const bookImage = req.body?.bookImage?.trim() || undefined;
        const description = req.body?.description?.trim() || undefined;
        const bookPdf = req.body?.bookPdf?.trim() || undefined;

        const totalNumberOfBooks = Number(req.body?.totalNumberOfBooks);

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

        if (!bookVideo) {
            return res.status(400).json({
                error: 'bookVideo is empty!',
            });
        }

        if (!bookPrimaryColor) {
            return res.status(400).json({
                error: 'bookPrimaryColor is empty!',
            });
        }

        if (!bookImage) {
            return res.status(400).json({
                error: 'bookImage is empty!',
            });
        }

        if (
            req.body?.totalNumberOfBooks === undefined ||
            req.body?.totalNumberOfBooks === null ||
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

        if (!bookPdf) {
            return res.status(400).json({
                error: 'bookPdf is empty!',
            });
        }

        const result = await bookService.register(
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
        return res.status(err?.status || 500).json({
            message: 'Internal Server Error',
            error: err.message,
        });
    }
});

router.get('/getAll', async (req, res) => {
    const result = await bookService.getAll();

    return res.json(result);
});

export default router;