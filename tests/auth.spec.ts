import { test, expect } from '@playwright/test';

const baseUrl = 'https://restful-booker.herokuapp.com';

test('valid credentials return an auth token', async ({ request }) => {
  const response = await request.post(`${baseUrl}/auth`, {
    data: { username: 'admin', password: 'password123' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.token).toBeTruthy();
  expect(typeof body.token).toBe('string');
});

test('a wrong password returns no token', async ({ request }) => {
  const response = await request.post(`${baseUrl}/auth`, {
    data: { username: 'admin', password: 'wrong-password' },
  });

  const body = await response.json();
  expect(body.token).toBeUndefined();
  expect(body.reason).toBe('Bad credentials');
});

// Defect: a failed login should be 401, but the API returns 200.
test('wrong login should give 401, not 200', async ({ request }) => {
  const response = await request.post(`${baseUrl}/auth`, {
    data: { username: 'admin', password: 'wrong-password' },
  });

  expect(response.status()).toBe(401);
});
