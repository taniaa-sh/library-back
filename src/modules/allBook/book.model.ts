import mongoose, { Schema, Types } from "mongoose";

export interface IBook extends mongoose.Document {
    _id: Types.ObjectId;
    id: number;
    title: string;
    author: string;
    genre: string;
    bookVideo: string;
    bookPrimaryColor: string;
    bookImage: string;
    totalNumberOfBooks: number;
    description: string;
    bookPdf: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        author: {
            type: String,
            required: true,
            trim: true,
        },

        genre: {
            type: String,
            required: true,
            enum: ["Fiction", "Non-fiction", "Science", "Biography"],
        },

        bookVideo: {
            type: String,
            required: true,
        },

        bookPrimaryColor: {
            type: String,
            required: true,
        },

        bookImage: {
            type: String,
            required: true,
        },

        totalNumberOfBooks: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        bookPdf: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const BookModel = mongoose.model<IBook>("Book", BookSchema);