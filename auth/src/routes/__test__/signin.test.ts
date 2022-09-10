import request from 'supertest';
import app from '../../app';

describe('Signin Testing', () => {
  it('Return a 400 invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'testtest.com',
        password: 'password',
      })
      .expect(400);
  });
  it('Return a 400 invalid password length', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'p',
      })
      .expect(400);
  });
  it('Fail when an email is not exist', async () => {
    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
    expect(response.body.errors[0].message).toEqual('User not found');
  });
  it('Have Set-Cookie header and login successful', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
  it('Fail when an incorrect credentials supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'passwodrd',
      })
      .expect(400);
    expect(response.get('Set-Cookie')).not.toBeDefined();
  });
});
