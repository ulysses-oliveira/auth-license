import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import v1Routes from './routes/v1';
import { errorConverter, errorHandler } from './middlewares/error';
import { ApiError } from './utils/ApiError';

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
//app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());

// jwt authentication
app.use(passport.initialize());

// Rota de Olá Mundo
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// v1 api routes
app.use('/v1', v1Routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
