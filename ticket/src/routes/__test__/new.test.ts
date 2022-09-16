import request from 'supertest';
import app from '../../app';

import { Ticket } from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

describe('New ticket route handler', () => {
  it('Has a route handler listen to /api/tickets for post request', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
  });
  it('Can only access if user is signed in', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).toEqual(401);
  });

  it('Return status other than 401 if the user is signed in', async () => {
    const token = await signin();
    const response = await request(app).post('/api/tickets').set('Cookie', token).send({});
    expect(response.status).not.toEqual(401);
  });

  it('Return an error if an invalid title is provided', async () => {
    const token = await signin();
    const response = await request(app).post('/api/tickets').set('Cookie', token).send({
      title: '',
      price: 1000,
    });
    expect(response.status).toEqual(400);
  });

  it('Return an error if an invalid price is provided', async () => {
    const token = await signin();
    const response = await request(app).post('/api/tickets').set('Cookie', token).send({
      title: 'Nice title',
      price: -1000,
    });
    expect(response.status).toEqual(400);
  });

  it('Create a ticket if valid input', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const token = await signin();
    await request(app).post('/api/tickets').set('Cookie', token).send({
      title: 'Nice title',
      price: 1000,
    });
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(1000);
    expect(tickets[0].title).toEqual('Nice title');
  });

  it('Publish an event', async () => {
    const token = await signin();
    await request(app)
      .post('/api/tickets')
      .set('Cookie', token)
      .send({
        title: 'Nice title',
        price: 1000,
      })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
