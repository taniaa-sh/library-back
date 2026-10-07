import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { setHeaders } from "./src/middlewares/header";
import authRouter from "./src/modules/auth/auth.routes";
import apiDocRouter from "./src/modules/apiDoc/swagger.routes";

const app = express();

app.use(cors());
app.use(cookieParser());

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(setHeaders);

app.use(
  "/univercityIdImage",
  express.static("public/univercityIdImage")
);

app.use("/auth", authRouter);
app.use("/apiDoc", apiDocRouter);

app.use((req: Request, res: Response) => {
  console.log("this path is not found", req.path);

  return res.status(404).json({
    message: "path not found 404",
  });
});

export default app;