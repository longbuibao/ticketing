import { Message } from 'node-nats-streaming';
import { Subjects, ExpirationCompleteEvent, Listener, OrderStatus } from '@lbbticket/common';

import { OrderCancelledPublisher } from '../publishers';

import { Order } from '../../models';
import { orderQGroupName } from './q-group-name';

export class OrderExpirationListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  qGroupName = orderQGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) throw new Error('Not found order');
    order.set({ status: OrderStatus.Cancle });

    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}
