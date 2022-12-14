import request from 'supertest';
import app from '../../app';

describe('Signout Testing', () => {
  it('Clear the cookie after signout', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);
    const response = await request(app)
      .post('/api/users/signout')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);
    expect(response.get('Set-Cookie')[0]).toContain('session=;');
  });
});
