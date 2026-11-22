import express from 'express';
import middleware404 from './middlewares/404'
import middlewaresException from './middlewares/exception'
import routers from './modules';
import cors from 'cors';
import path from 'path';
import middlewares from './middlewares/middlewares';

const allowedOrigins = [
    'https://library.taniashafiee.ir',
    'http://localhost:3004',
    'http://localhost',
];

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use(
    cors({
        origin: allowedOrigins,
        methods: [
            'GET',
            'HEAD',
            'PUT',
            'PATCH',
            'POST',
            'DELETE',
            'OPTIONS',
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
        ],
        credentials: false,
        optionsSuccessStatus: 204,
    })
);

app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'public', 'uploads'))
);

middlewares(app);
routers(app);
middlewaresException(app);
middleware404(app);

export default app;