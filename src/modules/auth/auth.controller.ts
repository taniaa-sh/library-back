import express from 'express';
import { AuthService } from './auth.service';

const router = express.Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
    try {
        const fullName = req.body?.fullName?.trim() || undefined
        const email = req.body?.email?.trim() || undefined
        const universityId = req.body?.universityId?.trim() || undefined
        const password = req.body?.password?.trim() || undefined

        if (!fullName || fullName == '') {
            return res.status(400).json({
                error: "fullName is empty!"
            })
        }

        if (!email || email == '') {
            return res.status(400).json({
                error: "email is empty!"
            })
        }

        if (!universityId || universityId == '') {
            return res.status(400).json({
                error: "username is empty!"
            })
        }

        if (!password || password == '') {
            return res.status(400).json({
                error: "password is empty!"
            })
        }

        const result = await authService.register(
            fullName,
            email,
            universityId,
            password,
        );

        return res.json(result);
    } catch (err: any) {
        res.status(err?.status || 500).json({ message: "Internal Server Error", error: err.message });
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

export default router;