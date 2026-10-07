import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import express from "express";

const router = express.Router();

const swaggerOptions = {
    customCss: "",
};

router.use("/", swaggerUi.serve);

router.get("/", swaggerUi.setup(swaggerDocument, swaggerOptions));

export default router;