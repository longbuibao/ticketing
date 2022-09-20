import { Message } from "node-nats-streaming";

import { Listener, OrderCancelledEvent, Subjects } from "@lbbticket/common";

import { ticketServiceQGroupName } from "./q-group-name";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error("Not found");
    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
      userId: ticket.userId,
    });
    msg.ack();
  }

  qGroupName: string = ticketServiceQGroupName;
  subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;
}
