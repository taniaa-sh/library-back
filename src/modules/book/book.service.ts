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
        const users = await this.bookModel.find().exec();

        return users;
    }
}