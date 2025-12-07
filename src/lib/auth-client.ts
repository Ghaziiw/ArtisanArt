import { createAuthClient } from 'better-auth/client';

export const BASE_URL = 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: BASE_URL,
});
