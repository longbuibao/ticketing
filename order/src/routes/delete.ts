import express, { Request, Response } from 'express';

import { NotFoundError, requireAuth, NotAuthorizedError, OrderStatus } from '@lbbticket/common';

import { Order } from '../models';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError('Not found this order');
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancle;
  await order.save();

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
