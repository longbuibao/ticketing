import { Listener, OrderCreatedEvent, Subjects } from '@lbbticket/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { qGroupName } from './q-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  qGroupName = qGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = await Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.orderStatus,
      userId: data.userId,
      version: data.version,
    }).save();

    msg.ack();
  }
}
