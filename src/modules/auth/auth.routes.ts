import express from "express";

import { register, login } from "./auth.controller";

import { multerStorage } from "@/middlewares/uploader";

const router = express.Router();

const upload = multerStorage(
    "public/univercityIdImage",
    /jpeg|jpg|png|webp/
);

router.post("/register", upload.single("media"), register);

router.post("/login", login);

export default router;