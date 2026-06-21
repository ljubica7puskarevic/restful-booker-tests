import { test, expect } from './fixtures';
import { validBooking } from './helpers/api';

test.describe('Booking - CRUD happy paths', () => {
  test('GET /booking returns a list of booking ids', async ({
    request,
  }) => {
    const response = await request.get('/booking');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(typeof body[0].bookingid).toBe('number');
  });

  test('GET /booking/:id returns the created booking', async ({
    request,
    createBooking,
  }) => {
    const payload = validBooking();
    const id = await createBooking(payload);

    const response = await request.get(`/booking/${id}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual(payload);
  });

  test('POST /booking creates a booking and returns it', async ({
    request,
  }) => {
    const payload = validBooking();

    const response = await request.post('/booking', { data: payload });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(typeof body.bookingid).toBe('number');
    expect(body.booking).toEqual(payload);
  });

  test('PUT /booking/:id updates a booking when authenticated', async ({
    request,
    createBooking,
    token,
  }) => {
    const id = await createBooking();
    const update = validBooking({ firstname: 'Updated', totalprice: 999 });

    const response = await request.put(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
      data: update,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual(update);
  });

  test('DELETE /booking/:id removes a booking when authenticated', async ({
    request,
    createBooking,
    token,
  }) => {
    const id = await createBooking();

    const deleteResponse = await request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });

    // restful-booker answers a successful delete with 201, not 200/204.
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await request.get(`/booking/${id}`);
    expect(getResponse.status()).toBe(404);
  });
});

test.describe('Booking - negative & security', () => {
  test('PUT /booking/:id without a token returns 403', async ({
    request,
    createBooking,
  }) => {
    const id = await createBooking();

    const response = await request.put(`/booking/${id}`, {
      data: validBooking({ firstname: 'Hacker' }),
    });

    expect(response.status()).toBe(403);
  });
});

test.describe('Booking - known defects (expected to fail)', () => {
  test('checkout before checkin should be rejected', async ({
    request,
  }) => {
    const response = await request.post('/booking', {
      data: validBooking({
        bookingdates: { checkin: '2025-12-31', checkout: '2025-01-01' },
      }),
    });

    expect(response.status()).toBe(400);
  });

  test('deleting a non-existent booking should give 404, not 405', async ({
    request,
    token,
  }) => {
    const response = await request.delete('/booking/99999999', {
      headers: { Cookie: `token=${token}` },
    });

    // The route exists, the record doesn't — that's a 404, not a 405.
    expect(response.status()).toBe(404);
  });
});
