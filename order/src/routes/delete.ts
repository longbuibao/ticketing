import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError } from '@lbbticket/common';

import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {}
);

export { router as deleteOrderRouter };
