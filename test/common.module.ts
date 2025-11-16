import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { Server } from 'http';

export async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const server = app.getHttpServer() as Server;
  return { app, server };
}

export async function signIn(server: Server, email: string, password: string) {
  const res = await request(server)
    .post('/api/auth/sign-in/email')
    .set('Content-Type', 'application/json')
    .send({ email, password })
    .expect(200);

  const cookies = res.headers['set-cookie'];
  return { cookies };
}

export async function signOut(server: Server, cookies: string[]) {
  await request(server)
    .post('/api/auth/sign-out')
    .set('Cookie', cookies)
    .expect(200);
}
