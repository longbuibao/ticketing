import express from 'express';

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

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
