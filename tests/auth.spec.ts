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
