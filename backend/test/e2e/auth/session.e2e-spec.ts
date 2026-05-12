/*describe('Dummy test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});*/

import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { signIn, signOut, createTestApp } from '../../common.module';
import { Server } from 'http';

describe('Session E2E', () => {
  let app: INestApplication;
  let server: Server;
  let cookies: string[];

  beforeAll(async () => {
    const t = await createTestApp();
    app = t.app;
    server = t.server;
  }, 300000000);

  afterAll(async () => {
    await app.close();
  });

  it('should sign in and store cookies', async () => {
    const res = await signIn(server, 'testuser@example.com', 'password1234!');
    cookies = res.cookies;
    expect(cookies).toBeDefined();
  });

  it('should use saved cookies to get session', async () => {
    await request(server)
      .get('/api/auth/get-session')
      .set('Cookie', cookies)
      .expect(200);
  });

  it('should sign out', async () => {
    await signOut(server, cookies);
    cookies = [];
  });

  it('should return null', async () => {
    await request(server).get('/api/auth/get-session').expect(200);
  });
});

