import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@lbbticket/common';

const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cookieSession({
    signed: false,
  })
);

app.all('*', () => {
  throw new NotFoundError('Not found this route');
});

app.use(errorHandler);

export default app;
