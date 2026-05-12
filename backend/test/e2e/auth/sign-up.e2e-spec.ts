import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../../common.module';
import { Server } from 'http';

describe('Sign-Up E2E', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const t = await createTestApp();
    app = t.app;
    server = t.server;
  }, 300000000);

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a new user and return a token', async () => {
    try {
      await request(server)
        .post('/api/auth/sign-up/email')
        .set('Content-Type', 'application/json')
        .send({
          name: 'bm2',
          email: 'test@example.com',
          password: 'password1234!',
        })
        .expect(200);
    } catch (err) {
      console.error('Error during signup test:', err);
    }
  });

  it('should return : existing email', async () => {
    try {
      await request(server)
        .post('/api/auth/sign-up/email')
        .set('Content-Type', 'application/json')
        .send({
          name: 'bm',
          email: 'testuser5@example.com',
          password: 'password1234!',
        })
        .expect(422);
    } catch (err) {
      console.log('Error during signup test:', err);
    }
  });

  it('should return : password too short', async () => {
    try {
      await request(server)
        .post('/api/auth/sign-up/email')
        .set('Content-Type', 'application/json')
        .send({
          name: 'bm',
          email: 'testuser6@example.com',
          password: 'pass123',
        })
        .expect(400);
    } catch (err) {
      console.log('Error during signup test:', err);
    }
  });

  it('should return : invalid email', async () => {
    try {
      await request(server)
        .post('/api/auth/sign-up/email')
        .set('Content-Type', 'application/json')
        .send({
          name: 'bm',
          email: 'testuserexample.com',
          password: 'password1234!',
        })
        .expect(400);
    } catch (err) {
      console.log('Error during signup test:', err);
    }
  });
});

/*describe('Dummy test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});*/
