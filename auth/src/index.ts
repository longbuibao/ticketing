import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from './routes';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors';

const app = express();
app.set('trust proxy', true);

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
  throw new NotFoundError('Not found this route');
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  try {
    console.log('Connecting to mongodb...');
    await mongoose.connect('mongodb://auth-mongo-clusterip-srv:27017/auth');
    console.log('Connected to Mongodb');
  } catch (error) {
    console.error(error);
  }
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

start();
