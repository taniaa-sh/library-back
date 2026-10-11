import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../modules/auth/auth.model";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export interface AuthRequest extends Request {
    user?: IUser;
    token?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: 401, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // 2. Verify token
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ status: 401, message: "Invalid token" });
        }

        // 3. Find user in database and check token matches
        const user = await UserModel.findOne({ _id: decoded.id, currentToken: token });
        if (!user) {
            return res.status(401).json({ status: 401, message: "User not found or token invalid" });
        }

        // 4. Attach user to request
        req.user = user;
        req.token = token;

        // 5. Continue
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};