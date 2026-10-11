import { Request, Response, NextFunction } from "express";

const middlewareException = (app: any) => {
    app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
        res.status(500).json({
            status: 500,
            message: "Internal server error!",
            errorMessage: error?.message,
            error
        });
    });
};

export default middlewareException;