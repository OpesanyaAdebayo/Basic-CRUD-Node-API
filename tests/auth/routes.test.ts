import supertest from 'supertest';
import app from '../../src/index';

const randomString =
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15);
const randomEmail = `${randomString}@gmail.com`;
const testPassword = '123456';
let token: string;

test('Login should return error with invalid email address', async () => {
  const result = await supertest(app)
    .post('/v1/login')
    .send({
      email: 'zxcvb',
      password: 'zxcvb'
    });
  expect(result.body.success).toBe(false);
});

test('Signup should return error with invalid email address', async () => {
  const result = await supertest(app)
    .post('/v1/signup')
    .send({
      email: 'zxcvb',
      password: 'zxcvb'
    });
  expect(result.body.success).toBe(false);
});

test('Signup should return error with password less than 6 characters', async () => {
  const result = await supertest(app)
    .post('/v1/signup')
    .send({
      email: 'zxcvb',
      password: 'bayoo'
    });
  expect(result.body.success).toBe(false);
});

test('Login should return error with unregistered email address', async () => {
  const result = await supertest(app)
    .post('/v1/login')
    .send({
      email: randomEmail,
      password: testPassword
    });
  expect(result.body.success).toBe(false);
});

test('Signup should return success with valid email address', async () => {
  const result = await supertest(app)
    .post('/v1/signup')
    .send({
      email: randomEmail,
      password: testPassword
    });
  expect(result.body.success).toBe(true);
});

test('Signup should return error with registered email address', async () => {
  const result = await supertest(app)
    .post('/v1/signup')
    .send({
      email: randomEmail,
      password: testPassword
    });
  token = result.body.data;
  expect(result.body.success).toBe(false);
});

test('Login should return success with valid email address', async () => {
  const result = await supertest(app)
    .post('/v1/login')
    .send({
      email: randomEmail,
      password: testPassword
    });
  token = result.body.data;
  expect(result.body.success).toBe(true);
});

test('Login should return error with incorrect password', async () => {
  const result = await supertest(app)
    .post('/v1/login')
    .send({
      email: randomEmail,
      password: 'testPassword'
    });
  expect(result.body.success).toBe(false);
});

test('Change Password should return error with incorrect old password', async () => {
  const result = await supertest(app)
  .post('/v1/changepassword')
  .send({
    email: randomEmail,
    newPassword: 'testPassword',
    oldPassword: 'testPassword'
  })
  .set('Authorization', `Bearer ${token}`);
  expect(result.body.success).toBe(false);
});

test('Change Password should return error with new password less than 6 characters', async () => {
  const result = await supertest(app)
    .post('/v1/changepassword')
    .send({
      email: randomEmail,
      newPassword: 'test',
      oldPassword: testPassword
    })
    .set('Authorization', `Bearer ${token}`);
  expect(result.body.success).toBe(false);
});

test('Change Password should return success with correct input', async () => {
  const result = await supertest(app)
    .post('/v1/changepassword')
    .send({
      email: randomEmail,
      newPassword: 'testPassword',
      oldPassword: testPassword
    })
    .set('Authorization', `Bearer ${token}`);
  expect(result.body.success).toBe(true);
});
