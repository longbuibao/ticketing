import express, { Request, Response } from 'express';

import { NotFoundError, requireAuth } from '@lbbticket/common';

import { Ticket } from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.status(200).send(tickets);
});

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const ticket = await Ticket.findById(id);
  if (!ticket) throw new NotFoundError('Not found this ticket');
  res.status(200).send(ticket);
});

export { router as showTicketRouter };
