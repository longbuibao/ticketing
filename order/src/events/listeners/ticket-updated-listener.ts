import { Message } from 'node-nats-streaming';
import { Subjects, TicketUpdatedEvent, Listener, NotFoundError } from '@lbbticket/common';

import { Ticket } from '../../models';
import { orderQGroupName } from './q-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  qGroupName = orderQGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = await Ticket.findById(id);

    if (!ticket) throw new NotFoundError('Not found this ticket');
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
