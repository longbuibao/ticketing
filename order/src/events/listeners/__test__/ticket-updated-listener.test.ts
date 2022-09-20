import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@lbbticket/common";
import mongoose from "mongoose";

import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = await Ticket.build({
    title: "title",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  }).save();

  const data: TicketUpdatedEvent["data"] = {
    title: "new title",
    price: 999,
    id: ticket.id,
    version: ticket.version + 1,
    userId: "dude",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("Find, update and saves ticket", async () => {
  const { listener, msg, ticket, data } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(ticket.version + 1);
});

it("call the ack fn message", async () => {
  const { listener, msg, ticket, data } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket!.title).toEqual("new title");
  expect(updatedTicket!.price).toEqual(999);
  expect(updatedTicket!.version).toEqual(ticket.version + 1);
  expect(msg.ack).toBeCalled();
});

it("Does not call ack if the event has a skipped version", async () => {
  const { listener, msg, ticket, data } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (e) {
    expect(msg.ack).not.toBeCalled();
  }
});
