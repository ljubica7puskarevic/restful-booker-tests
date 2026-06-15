import { test, expect } from '@playwright/test';

test('should generate auth token', async ({ request }) => {
  const response = await request.post(
    'https://restful-booker.herokuapp.com/auth',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: 'admin',
        password: 'password123',
      },
    }
  );
  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.token).toBeTruthy();
  expect(typeof body.token).toBe('string');

  console.log('Generated token:', body.token);
});