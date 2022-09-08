import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from './routes';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

app.use(errorHandler);

const start = async () => {
  try {
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
