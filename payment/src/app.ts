import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@lbbticket/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
  })
);
app.use(currentUser);

app.all('*', async (req, res) => {
  throw new NotFoundError('DUde? where are you going?');
});

app.use(errorHandler);

export { app };
