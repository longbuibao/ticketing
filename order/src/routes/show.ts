import express, { Request, Response } from 'express';

import { NotAuthorizedError, NotFoundError, requireAuth } from '@lbbticket/common';

import { Order } from '../models';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if (!order) throw new NotFoundError(`Not found this orderId ${req.params.orderId}`);
  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
  res.send(order);
});

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');
  res.send(orders);
});

export { router as showOrderRouter };
