import mongoose, { Schema, Types } from "mongoose";

export interface IReview extends mongoose.Document {
    _id: Types.ObjectId;
    bookId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewModel = new Schema<IReview>(
    {
        bookId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Book",
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxLength: 1000,
        },
    },
    {
        timestamps: true,
    }
);

ReviewModel.index({ bookId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewModel);