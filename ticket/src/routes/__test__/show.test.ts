import request from 'supertest';
import app from '../../app';

describe('Show ticket route handler', () => {
  it('Return 404 if a ticket is not found', async () => {
    await request(app).get('/api/ticket/dsdsdsdsd').send().expect(404);
  });
  it('Return the ticket if the ticket is found', async () => {
    const token = await signin();
    const ticket = await request(app)
      .post('/api/tickets')
      .set('Cookie', token)
      .send({
        title: 'Nice title',
        price: 1000,
      })
      .expect(201);
    await request(app).get(`/api/tickets/${ticket.body.id}`).send().expect(200);
    expect(ticket.body.title).toEqual('Nice title');
    expect(ticket.body.price).toEqual(1000);
  });
});
