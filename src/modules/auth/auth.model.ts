
import mongoose, { Schema, Types } from "mongoose";

export interface IUser extends mongoose.Document {
    _id: Types.ObjectId;
    id: number;
    email: string;
    fullName: string;
    universityId: string;
    university?: string | null;
    password: string;
    role: "ADMIN" | "USER";
    univercityIdImage: string;
    profileImage?: string | null;
    currentToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
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
        university: {
            type: String,
            default: null,
            trim: true,
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
            required: true,
        },
        profileImage: {
            type: String,
            default: null,
        },
        currentToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.index({ currentToken: 1 }, { sparse: true });

export const UserModel = mongoose.model<IUser>("User", UserSchema);