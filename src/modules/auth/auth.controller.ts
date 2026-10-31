import express from 'express';
import { AuthService } from './auth.service';
import { authMiddleware, AuthRequest } from '../../middlewares/jwtAuth';

const router = express.Router();
const authService = new AuthService();

router.get('/getAll', async (req, res) => {
    const result = await authService.getAll();

    return res.json(result);
});

router.post('/register', async (req, res) => {
    try {
        const fullName = req.body?.fullName?.trim() || undefined;
        const email = req.body?.email?.trim() || undefined;
        const universityId = req.body?.universityId?.trim() || undefined;
        const password = req.body?.password?.trim() || undefined;
        const univercityIdImage =
            req.body?.univercityIdImage?.trim() || undefined;

        if (!fullName) {
            return res.status(400).json({
                error: "fullName is empty!"
            });
        }

        if (!email) {
            return res.status(400).json({
                error: "email is empty!"
            });
        }

        if (!universityId) {
            return res.status(400).json({
                error: "universityId is empty!"
            });
        }

        if (!password) {
            return res.status(400).json({
                error: "password is empty!"
            });
        }

        if (!univercityIdImage) {
            return res.status(400).json({
                error: "univercityIdImage is empty!"
            });
        }

        const result = await authService.register(
            fullName,
            email,
            universityId,
            password,
            univercityIdImage
        );

        return res.json(result);
    } catch (err: any) {
        return res.status(err?.status || 500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const email = req.body?.email?.trim() || undefined
        const password = req.body?.password?.trim() || undefined

        if (!password || password == '') {
            return res.status(400).json({
                error: "password is empty!"
            })
        }

        const result = await authService.login(
            email,
            password,
        );

        return res.json(result);
    } catch (err: any) {
        res.status(err?.status || 500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.post('/logout', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const logout = await authService.logout(req.user._id.toString());

        return res.json(logout);
    } catch (err: any) {
        res.status(err?.status || 500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.post('reset-password', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const password = req.body?.password?.trim() || undefined;
        const confirmPass = req.body?.confirmPass?.trim() || undefined;

        if (!password || !confirmPass) {
            return res.status(400).json({
                message: "Password and confirm password are required",
            });
        }

        if (password !== confirmPass) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,30}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password does not meet the required criteria",
            });
        }

        const result = await authService.resetPassword(
            req.user._id.toString(),
            password
        );

        return res.json(result);
    } catch (err: any) {
        res.status(err?.status || 500).json({ message: "Internal Server Error", error: err.message });
    }
})

router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const user  = await authService.getProfile(
            req.user._id.toString()
        );

        return res.json(user);
    } catch (err: any) {
        return res.status(err?.status || 500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

router.put("/update-profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const {
            fullName,
            email,
            universityId,
            university,
            profileImage,
        } = req.body;

        const result = await authService.updateProfile(
            req.user._id.toString(),
            {
                fullName,
                email,
                universityId,
                university,
                profileImage,
            }
        );

        return res.json(result);
    } catch (err: any) {
        return res.status(err?.status || 500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
});

export default router;