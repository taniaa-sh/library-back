import express from 'express';
import middleware404 from './middlewares/404'
import middlewaresException from './middlewares/exception'
import middlewares from './middlewares/middlewares';
import routers from './modules';

const app = express();

middlewares(app);
routers(app);
middlewaresException(app);
middleware404(app);

export default app;