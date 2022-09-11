import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@lbbticket/common';

import { User } from '../models/User';
import { SignupBody } from '../types';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .isLength({
        min: 4,
        max: 20,
      })
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body as SignupBody;
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      throw new BadRequestError('User not found');
    }

    const isPasswordMatch = await Password.compare(existingUser.password, password);
    if (!isPasswordMatch) throw new BadRequestError('Bad credentials');
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send({ existingUser });
  }
);

export { router as signinRouter };
