import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@lbbticket/common';

import { Order } from '../models/Order';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Cannot found this order');
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancle)
      throw new BadRequestError(`order status is invalid, current status is ${order.status}`);
    const strRes = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    res.status(201).send({ strRes });
  }
);

export { router as createChargeRouter };
