import request from 'supertest';
import app from '../../app';

describe('Show all ticket', () => {
  it('Show all ticket from database', async () => {
    const token = await signin();
    const ticketsToCreated = [
      { title: 'dude', price: 100 },
      { title: 'hello', price: 20 },
      { title: 'VN', price: 200 },
    ];
    await Promise.all(
      ticketsToCreated.map((ticket) =>
        request(app)
          .post('/api/tickets')
          .set('Cookie', token)
          .send({
            ...ticket,
          })
          .expect(201)
      )
    );

    const tickets = await request(app).get('/api/tickets').send().expect(200);
    expect(tickets.body.length).toEqual(ticketsToCreated.length);
  });
});
