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

import { Order, Payment } from '../models';
import { stripe } from '../stripe';
import { PaymentCreatedPubliser } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = await Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    }).save();

    new PaymentCreatedPubliser(natsWrapper.client).publish({
      id: payment.id,
      order: order.id,
      stripeId: charge.id,
    });

    res.status(201).send(payment);
  }
);

export { router as createChargeRouter };
