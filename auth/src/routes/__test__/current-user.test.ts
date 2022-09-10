import request from 'supertest';
import app from '../../app';

describe('Get current user', () => {
  it('Respone detail with current user', async () => {
    const cookie = await global.signin();
    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
  });

  it('responds with null if not authenticated', async () => {
    const response = await request(app).get('/api/users/currentuser').send().expect(401);
    expect(response.body.errors[0].message).toEqual('Not authorized');
  });
});
