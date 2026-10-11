import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const middlewares = (app: any) => {
    app.use(cors());
    app.use(json({ limit: '50mb' }));
    app.use(cookieParser());
    app.use(urlencoded({ limit: '50mb', extended: true }));
}

export default middlewares