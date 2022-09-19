import { Ticket } from '../Ticket';

it('Implement optimistic concurrency controll', async () => {
  const ticket = await Ticket.build({ price: 10, title: 'hello', userId: 'ldkfj' }).save();

  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  console.log(firstTicket);

  firstTicket?.set({ price: 10 });
  secondTicket?.set({ price: 15 });

  await firstTicket?.save();

  console.log(firstTicket);
  try {
    await secondTicket?.save();
  } catch (error) {
    expect(error).toBeDefined();
  }
});

it('Increase the version number after update', async () => {
  const ticket = await Ticket.build({
    price: 1,
    title: 'lhell',
    userId: 'lfjhdslkfdjslkfj',
  }).save();
  const changes = [{ title: 'hel' }, { price: 13 }, { price: 20 }];

  ticket.set(changes[0]);
  await ticket.save();
  ticket.set(changes[1]);
  await ticket.save();
  ticket.set(changes[2]);
  await ticket.save();

  expect(ticket.version).toEqual(3);
  expect(ticket.price).toEqual(20);
  expect(ticket.title).toEqual('hel');
});
