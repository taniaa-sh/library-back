import dotenv from "dotenv";
import ReviewModel from "./review.model";
import mongoose from "mongoose";
import { BookModel } from "../allBook/book.model";

dotenv.config();

export class ReviewService {
    private reviewModel = ReviewModel;

    async addReview(
        bookId: number,
        userId: string,
        rating: number,
        comment: string
    ) {
        if (!Number.isInteger(bookId) || bookId <= 0) {
            throw new Error("Invalid bookId");
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid userId");
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new Error("Rating must be an integer between 1 and 5");
        }

        const trimmedComment = comment?.trim();

        if (!trimmedComment || trimmedComment.length > 1000) {
            throw new Error(
                "Comment is required and must be at most 1000 characters"
            );
        }

        // جستجوی کتاب بر اساس id عددی
        const book = await BookModel.findOne({ id: bookId });

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

    async getAll(bookId?: number) {
        const filter = bookId !== undefined ? { bookId } : {};

        return this.reviewModel
            .find(filter)
            .populate("userId", "fullName")
            .sort({ createdAt: -1 })
            .exec();
    }
}