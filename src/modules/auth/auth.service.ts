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

    async logout(userId: string | Types.ObjectId) {
        await this.userModel.findByIdAndUpdate(userId, { currentToken: null });
        return { success: true, message: "Logged out successfully" };
    }
}