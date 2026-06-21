import { test, expect } from './fixtures';
import { ADMIN_CREDS } from './helpers/api';

test.describe('Auth - POST /auth', () => {
  test('valid credentials return an auth token', async ({
    request,
  }) => {
    const response = await request.post('/auth', {
      data: ADMIN_CREDS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe('string');
  });

  test('a wrong password returns no token', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong-password' },
    });

    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('wrong login should give 401, not 200', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong-password' },
    });

    expect(response.status()).toBe(401);
  });
});
