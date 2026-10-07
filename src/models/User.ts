import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    email: string;
    fulName: string;
    universityId: string;
    password: string;
    role: "ADMIN" | "USER";
    univercityIdImage: string;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },

        fulName: {
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
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", schema);

export default User;