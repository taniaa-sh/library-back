import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { UserModel } from './auth.model';
import { sign } from 'jsonwebtoken';
import { Types } from 'mongoose';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'secret';

export class AuthService {

    private loginSessions = new Map<string, { userId: string; secret: string }>();

    private userModel = UserModel;

    private generateJwtToken(id: string, email: string): string {
        const payload = { id, email };
        const token = sign(payload, jwtSecret, { expiresIn: '1h' });
        return token;
    }

    async register(
        fullName: string,
        email: string,
        universityId: string,
        password: string,
        univercityIdImage: string
    ) {
        const existing = await this.userModel.findOne({
            $or: [{ email }, { universityId }]
        }).exec();

        if (existing) {
            throw { status: 400, message: 'Email or universityId already used.' };
        }

        // generate id
        const last = await this.userModel.findOne({}, { id: 1 }).sort({ id: -1 }).exec();
        const newId = last && typeof last.id === 'number' ? last.id + 1 : 1;

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        // generate verify token
        const token = Math.floor(1000 + Math.random() * 9000);

        const user = new this.userModel({
            id: newId,
            email,
            fullName,
            universityId,
            password: hashed,
            univercityIdImage,
            role: "USER",
            verifyToken: token,
        });

        await user.save();
        return { message: 'Registration successful' };
    }

    async login(
        email: string,
        password: string,
    ) {

        // find user by email or username or phone
        const user = await this.userModel.findOne({
            $or: [
                { email: email }
            ]
        }).exec();

        if (!user) throw { status: 401, message: 'Invalid credentials: user not found.' };

        if (!user.password) throw { status: 401, message: 'No password set for user.' };

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw { status: 401, message: 'Invalid credentials: incorrect password.' };

        // complete login
        const token = this.generateJwtToken(user._id.toString(), user.email)

        user.currentToken = token;
        await user.save();

        return { accessToken: token, isAdmin: user.role === "ADMIN" };
    }

    async getAll() {
        const users = await this.userModel.find().select("-password -currentToken -univercityIdImage").exec();

        return users;
    }

    async logout(userId: string | Types.ObjectId) {
        await this.userModel.findByIdAndUpdate(userId, { currentToken: null });
        return { success: true, message: "Logged out successfully" };
    }

    async resetPassword(userId: string, password: string) {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw Object.assign(new Error("User not found"), {
                status: 404,
            });
        }

        user.password = await bcrypt.hash(password, 10);

        await user.save();

        return {
            success: true,
            message: "Password updated successfully",
        };
    }


    async getProfile(userId: string) {
        const user = await this.userModel
            .findById(userId)
            .select("-password -currentToken -univercityIdImage")
            .exec();

        if (!user) {
            throw Object.assign(new Error("User not found"), {
                status: 404,
            });
        }

        return user;
    }

    async updateProfile(
        userId: string,
        data: {
            fullName?: string;
            email?: string;
            universityId?: string;
            university?: string | null;
            profileImage?: string | null;
        }
    ) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw Object.assign(new Error("User not found"), {
                status: 404,
            });
        }

        if (data.email !== undefined) {
            const email = data.email.trim();

            const existingEmail = await this.userModel.findOne({
                email,
                _id: { $ne: user._id },
            });

            if (existingEmail) {
                throw Object.assign(new Error("Email already exists"), {
                    status: 400,
                });
            }

            user.email = email;
        }

        if (data.universityId !== undefined) {
            const universityId = data.universityId.trim();

            const existingId = await this.userModel.findOne({
                universityId,
                _id: { $ne: user._id },
            });

            if (existingId) {
                throw Object.assign(new Error("Student ID already exists"), {
                    status: 400,
                });
            }

            user.universityId = universityId;
        }

        if (data.fullName !== undefined) {
            user.fullName = data.fullName.trim();
        }

        if (data.university !== undefined) {
            user.university = data?.university?.trim() || null;
        }

        if (data.profileImage) {
            user.profileImage = data.profileImage;
        }

        await user.save();

        return {
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                universityId: user.universityId,
                university: user.university,
                profileImage: user.profileImage,
                role: user.role,
            },
        };
    }

}