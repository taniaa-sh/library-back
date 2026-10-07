import type { Request, Response } from "express";
import { successResponsse, errorResponsse } from "../../utils/responses";
import {
    registerValidationSchema,
    loginValidationSchema,
} from "./auth.validator";
import userModal from "../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface RegisterBody {
    email: string;
    fulName: string;
    universityId: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

export const register = async (
    req: Request<{}, {}, RegisterBody> & { file?: Express.Multer.File },
    res: Response
) => {
    try {
        const { email, fulName, universityId, password } = req.body;

        await registerValidationSchema.validate(
            { email, fulName, universityId, password },
            { abortEarly: false }
        );

        const isExiestUser = await userModal.findOne({
            $or: [{ universityId }, { email }],
        });

        if (isExiestUser) {
            return errorResponsse(res, 400, "Email or universityId is already exist");
        }

        const isFirstUser = (await userModal.countDocuments()) === 0;
        const role = isFirstUser ? "ADMIN" : "USER";
        const hashedPassword = await bcrypt.hash(password, 10);

        const imagePath = req.file
            ? `/univercityIdImage/${req.file.filename}`
            : null;

        const registerUser = await userModal.create({
            email,
            universityId,
            fulName,
            password: hashedPassword,
            role,
            univercityIdImage: imagePath,
        });

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error("JWT_SECRET is not defined");

        const accessToken = jwt.sign(
            { id: registerUser._id, email: registerUser.email },
            jwtSecret,
            { expiresIn: "7d" }
        );

        return successResponsse(res, 200, {
            accessToken,
            user: registerUser,
        });
    } catch (err: unknown) {
        console.log(err);
        return errorResponsse(
            res,
            500,
            err instanceof Error ? err.message : "Internal server error"
        );
    }
};

export const login = async (
    req: Request<{}, {}, LoginBody>,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        await loginValidationSchema.validate(
            { email, password },
            { abortEarly: false }
        );

        const user = await userModal.findOne({ email });

        if (!user) {
            return errorResponsse(res, 400, "this user not found");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return errorResponsse(res, 400, "password isnt match");
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error("JWT_SECRET is not defined");

        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            jwtSecret,
            { expiresIn: "7d" }
        );
        return successResponsse(res, 200, {
            accessToken,
            user,
        });

    } catch (err: unknown) {
        console.log(err);
        return errorResponsse(
            res,
            500,
            err instanceof Error ? err.message : "Internal server error"
        );
    }
};