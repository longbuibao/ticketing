import mongoose from 'mongoose';

import { OrderStatus } from '@lbbticket/common';

import { TicketDoc } from './Ticket';

interface OrderAttributes {
  orderId: string;
  status: OrderStatus;
  expireAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  orderId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttributes): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrderSchema.statics.build = (attrs: OrderAttributes) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('User', OrderSchema);

export { Order };
