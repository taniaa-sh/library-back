import express from 'express';
import middleware404 from './middlewares/404';
import middlewaresException from './middlewares/exception';
import routers from './modules';
import cors from 'cors';
import path from 'path';

const app = express();

const allowedOrigins = [
    'https://library.taniashafiee.ir',
    'http://localhost:3004',
];

app.use(cors({
    origin: 'https://library.taniashafiee.ir/ , http://localhost:3004',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
}));

app.use(cors());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'public', 'uploads'))
);

routers(app);
middlewaresException(app);
middleware404(app);

export default app;