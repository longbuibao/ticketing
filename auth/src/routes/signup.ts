import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { SignupBody } from '../types';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 6, max: 20 }).withMessage('Password must has length between 6 and 20'),
  ],
  (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send(error.array());
    }
    const { email, password } = req.body as SignupBody;
    res.send({ email, password });
  }
);

export { router as signupRouter };
