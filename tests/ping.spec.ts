import { test, expect } from '@playwright/test';

test('GET /ping returns 201 (service is up)', async ({ request }) => {
  const response = await request.get(
    'https://restful-booker.herokuapp.com/ping'
  );

  expect(response.status()).toBe(201);
});
