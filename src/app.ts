import express from 'express';
import middleware404 from './middlewares/404'
import middlewaresException from './middlewares/exception'
import middlewares from './middlewares/middlewares';
import routers from './modules';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use(cors(
    {
        origin: 'https://library.taniashafiee.ir/ , http://localhost:3001',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true
    }
));

app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'public', 'uploads'))
);

middlewares(app);
routers(app);
middlewaresException(app);
middleware404(app);

export default app;