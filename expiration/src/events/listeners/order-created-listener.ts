import { Message } from 'node-nats-streaming';

import { Listener, OrderCreatedEvent, Subjects } from '@lbbticket/common';

import { orderCreated } from './q-group-order-created';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const delay = new Date(data.expireAt).getTime() - new Date().getTime();

    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }

  qGroupName: string = orderCreated;
}
