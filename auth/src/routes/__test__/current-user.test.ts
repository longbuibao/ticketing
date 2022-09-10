import request from 'supertest';
import app from '../../app';

describe('Get current user', () => {
  it('Respone detail with current user', async () => {
    const authResponse = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', authResponse.get('Set-Cookie'))
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
  });
});
