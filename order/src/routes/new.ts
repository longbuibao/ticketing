import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@lbbticket/common';

import { OrderCreatedPublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';
import { Ticket, Order } from '../models';

const router = express.Router();

const EXPIRATION_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string): boolean => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket must be provied'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //find the ticket and make sure that this ticket is not reserved
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError('Not found this ticket');
    //a ticket is reserved if it associated with another order and that order must not have status of !cancle

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError('This ticket already been reserved');

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

    const order = await Order.build({
      userId: req.currentUser!.id,
      expireAt: expiration,
      status: OrderStatus.Created,
      ticket,
    }).save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      expireAt: order.expireAt.toISOString(),
      id: order.id,
      orderStatus: order.status,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      userId: order.userId,
    });

    res.status(201).send(order);
  }
);

export { router as createOrder };
