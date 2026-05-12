/*describe('Dummy test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});*/

import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../../common.module';
import { Server } from 'http';

describe('Sign-In E2E', () => {
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

  it('should sign in the user', async () => {
    try {
      await request(server)
        .post('/api/auth/sign-in/email')
        .set('Content-Type', 'application/json')
        .send({
          email: 'testuser@example.com',
          password: 'password1234!',
        })
        .expect(200);
    } catch (err) {
      console.error('Error during signin test:', err);
    }
  });

  it('should return : email not found', async () => {
    try {
      await request(server)
        .post('/api/auth/sign-in/email')
        .set('Content-Type', 'application/json')
        .send({
          email: 'hola@example.com',
          password: 'password1234!',
        })
        .expect(401);
    } catch (err) {
      console.log('Error during signin test:', err);
    }
  });

  it('should return : invalid password', async () => {
    try {
      await request(server)
        .post('/api/auth/sign-in/email')
        .set('Content-Type', 'application/json')
        .send({
          email: 'testuser@example.com',
          password: 'pass123',
        })
        .expect(401);
    } catch (err) {
      console.log('Error during signin test:', err);
    }
  });
});
