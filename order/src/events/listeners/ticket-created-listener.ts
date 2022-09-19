import { Message } from 'node-nats-streaming';
import { Subjects, TicketCreatedEvent, Listener } from '@lbbticket/common';

import { Ticket } from '../../models';
import { orderQGroupName } from './q-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  qGroupName = orderQGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, id, price } = data;

    await Ticket.build({
      title,
      id,
      price,
    }).save();

    msg.ack();
  }
}
