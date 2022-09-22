import { OrderCancelledEvent, Subjects, Listener, OrderStatus } from '@lbbticket/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { qGroupName } from './q-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  qGroupName = qGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) throw new Error('Not found order');
    order.set({ status: OrderStatus.Cancle });
    await order.save();
    msg.ack();
  }
}
