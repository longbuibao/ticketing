import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@lbbticket/common';

import { CreateTicket } from '../types';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title must valid'),
    body('price')
      .isFloat({
        gt: 0,
      })
      .withMessage('Price must be numeric'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body as CreateTicket;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
