import request from 'supertest';
import app from '../../app';

describe('Signup Testing', () => {
  it('Return a 201 on successfull signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it('Return a 400 invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'testtest.com',
        password: 'password',
      })
      .expect(400);
  });

  it('Return a 400 invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '',
      })
      .expect(400);
  });

  it('Return a 400 invalid input', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: '',
        password: '',
      })
      .expect(400);
  });

  it('Not allow duplicate email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '11011010',
      })
      .expect(201);
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '',
      })
      .expect(400);
  });

  it('Have Set-Cookie header', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
