import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "@/models/User";

export default async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies["accessToken"];

        if (!token) {
            return res.json({
                message: "please login",
            });
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const payload = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

        if (!payload) {
            return res.json({
                message: "please login",
            });
        }

        const userID = payload.id;

        const user = await userModel
            .findOne({ _id: userID })
            .lean();

        req.user = user;

        next();
    } catch (err: unknown) {
        console.log(err);
    }
};