import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { SignupBody } from '../types';
import { RequestValidationError, BadRequestError } from '../errors';
import { User } from '../models/User';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 6, max: 20 }).withMessage('Password must has length between 6 and 20'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new RequestValidationError(error.array());
    }
    const { email, password } = req.body as SignupBody;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    res.status(201).send({ user });
  }
);

export { router as signupRouter };
