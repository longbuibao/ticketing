import { Message } from 'node-nats-streaming';

import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@lbbticket/common';

import { Order } from '../../models';
import { orderQGroupName } from './q-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  qGroupName = orderQGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.order);
    if (!order) throw new Error('Not found this order');
    if (order.status === OrderStatus.Complete) return msg.ack();

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
