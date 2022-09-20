import { Message } from "node-nats-streaming";

import { Listener, OrderCreatedEvent, Subjects } from "@lbbticket/common";

import { ticketServiceQGroupName } from "./q-group-name";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    // prevent from user edit a ticket already reserved with an order id
    const ticket = await Ticket.findById(data.ticket.id)!;
    if (!ticket) throw new Error("Not found this ticket");
    ticket.set({ orderId: data.id });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      price: ticket.price,
      id: ticket.id,
      title: ticket.title,
      orderId: ticket.orderId,
      version: ticket.version,
      userId: ticket.userId,
    });
    msg.ack();
  }

  qGroupName: string = ticketServiceQGroupName;
  subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
}
