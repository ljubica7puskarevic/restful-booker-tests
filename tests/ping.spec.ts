import { test, expect } from './fixtures';

test.describe('Ping - GET /ping', () => {
  test('GET /ping returns 201 (service is up)', async ({
    request,
  }) => {
    const response = await request.get('/ping');

    expect(response.status()).toBe(201);
  });
});
