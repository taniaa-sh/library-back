import { Request, Response } from "express";

const middleware404 = (app: any) => {
    app.use((_req: Request, res: Response) => {
        res.status(404).json({
            status: 404,
            message: "Requested resource could not be found!"
        });
    });
};

export default middleware404;