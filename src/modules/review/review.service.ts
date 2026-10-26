import dotenv from 'dotenv';
import ReviewModel from './review.model';
import mongoose from 'mongoose';
import { BookModel } from '../allBook/book.model';

dotenv.config();

export class ReviewService {
    private reviewModel = ReviewModel;

    async addReview(bookId: number, userId: string, rating: number, comment: string) {
        if (
            !mongoose.Types.ObjectId.isValid(bookId) ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) { throw new Error("Invalid bookId or userId") }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new Error("Rating must be an integer between 1 and 5")
        }

        const trimmedComment = comment?.trim();
        if (!trimmedComment || trimmedComment.length > 1000) {
            throw new Error("Comment is required and must be at most 1000 characters");
        }

        const book = await BookModel.findById(bookId);

        if (!book) {
            const error = new Error("Book not found") as Error & {
                status?: number;
            };

            error.status = 404;
            throw error;
        }

        return this.reviewModel.findOneAndUpdate(
            { bookId, userId },
            {
                $set: {
                    rating,
                    comment: trimmedComment,
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        ).exec();
    }

    async getAll() {
        const reviews = await this.reviewModel.find().select("").exec();

        return reviews;
    }
}