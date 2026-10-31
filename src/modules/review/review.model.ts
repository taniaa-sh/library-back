import mongoose from "mongoose";

export interface IReview extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    bookId: number;
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>(
    {
        bookId: {
            type: Number,
            required: true,
            ref: "Book",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
    }
);

ReviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);