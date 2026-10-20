import { Router, Express } from "express";
import authRoutes from "../modules/auth/auth.routes";
import addBookRoutes from "../modules/allBook/book.routes";

const routers = (app: Express) => {
    // Create a base router for /api
    const apiRouter = Router();

    // Health check (no auth)
    apiRouter.get("/health", (_req, res) => res.json({ ok: true }));

    // Auth routes
    apiRouter.use("/auth", authRoutes);
    apiRouter.use("/allBook", addBookRoutes);

    // Mount /api prefix
    app.use("/api", apiRouter);
};

export default routers;