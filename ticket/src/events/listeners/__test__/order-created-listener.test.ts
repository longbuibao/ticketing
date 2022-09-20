import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/Ticket";
import { OrderCreatedEvent, OrderStatus } from "@lbbticket/common";
import mongoose from "mongoose";
import { ticketServiceQGroupName } from "../q-group-name";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = await Ticket.build({
    title: "djflkd",
    price: 2,
    userId: "fjd",
  }).save();

  const data: OrderCreatedEvent["data"] = {
    ticket: { id: ticket.id, price: ticket.price },
    userId: new mongoose.Types.ObjectId().toHexString(),
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    orderStatus: OrderStatus.Created,
    expireAt: "",
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("Set the orderId of the ticket", async () => {
  const { listener, msg, ticket, data } = await setup();
  await listener.onMessage(data, msg);
  const changedTicket = await Ticket.findById(ticket.id);
  expect(changedTicket!.orderId).toEqual(data.id);
});

it("call the ack message", async () => {
  const { listener, msg, data } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toBeCalled();
});

it("Publish a ticket updated event", async () => {
  const { listener, msg, data } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toBeCalled();
});
