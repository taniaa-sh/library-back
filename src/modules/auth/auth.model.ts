import mongoose, { Schema, Types } from "mongoose";

export interface IUser extends mongoose.Document {
    _id: Types.ObjectId;
    id: number;
    email: string;
    fullName: string;
    universityId: string;
    password: string;
    role: "ADMIN" | "USER";
    univercityIdImage: string;
    currentToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },

        fullName: {
            type: String,
            required: true,
        },

        universityId: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["ADMIN", "USER"],
            default: "USER",
        },

        univercityIdImage: {
            type: String,
            required: false,
        },

        currentToken: { 
            type: String, 
            default: null 
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast lookups by token
UserSchema.index({ currentToken: 1 }, { sparse: true });

export const UserModel = mongoose.model<IUser>("User", UserSchema);