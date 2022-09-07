import express from 'express';

import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from './routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
