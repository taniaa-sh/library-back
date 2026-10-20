import dotenv from 'dotenv';
import { BookModel } from './book.model';

dotenv.config();

export class BookService {
    private bookModel = BookModel;

    async addBook(
        title: string,
        author: string,
        genre: string,
        bookVideo: string,
        bookPrimaryColor: string,
        bookImage: string,
        totalNumberOfBooks: number,
        description: string,
        bookPdf: string
    ) {
        const lastBook = await BookModel.findOne().sort({ id: -1 });
        const id = lastBook ? lastBook.id + 1 : 1;

        const book = await BookModel.create({
            id,
            title,
            author,
            genre,
            bookVideo,
            bookPrimaryColor,
            bookImage,
            totalNumberOfBooks,
            description,
            bookPdf,
        });

        return {
            message: 'Book added successfully',
            book,
        };
    }

    async getAll() {
        const books = await this.bookModel.find().select("").exec();

        return books;
    }

    async getBookById(id: number) {
        const book = await this.bookModel.findOne({ id }).select("").exec();

        if (!book) {
            const error = new Error('Book not found') as Error & {
                status?: number;
            };
            error.status = 404;
            throw error;
        }

        return book;
    }

    async deleteBook(id: number) {
        const book = await this.bookModel.findOne({ id }).select("").exec();

        if (!book) {
            const error = new Error('Book not found') as Error & {
                status?: number;
            };
            error.status = 404;
            throw error;
        }

        await this.bookModel.deleteOne({ id });
        return { message: 'Book deleted successfully' };
    }

    async updateBook(
        id: number,
        title?: string,
        author?: string,
        genre?: string,
        bookVideo?: string,
        bookPrimaryColor?: string,
        bookImage?: string,
        description?: string,
        bookPdf?: string
    ) {
        const book = await this.bookModel.findOne({ id }).exec();

        if (!book) {
            const error = new Error('Book not found') as Error & {
                status?: number;
            };
            error.status = 404;
            throw error;
        }

        if (title !== undefined) book.title = title;
        if (author !== undefined) book.author = author;
        if (genre !== undefined) book.genre = genre;
        if (bookVideo !== undefined) book.bookVideo = bookVideo;
        if (bookPrimaryColor !== undefined) {
            book.bookPrimaryColor = bookPrimaryColor;
        }
        if (bookImage !== undefined) book.bookImage = bookImage;
        if (description !== undefined) book.description = description;
        if (bookPdf !== undefined) book.bookPdf = bookPdf;

        await book.save();

        return {
            message: 'Book updated successfully',
            data: book,
        };
    }
}