import { test, expect } from '@playwright/test';

const baseUrl = 'https://restful-booker.herokuapp.com';
const creds = { username: 'admin', password: 'password123' };

const booking = {
  firstname: 'Jim',
  lastname: 'Brown',
  totalprice: 111,
  depositpaid: true,
  bookingdates: { checkin: '2024-01-01', checkout: '2024-01-05' },
  additionalneeds: 'Breakfast',
};

test('GET /booking returns a list of booking ids', async ({
  request,
}) => {
  const response = await request.get(`${baseUrl}/booking`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
  expect(typeof body[0].bookingid).toBe('number');
});

test('GET /booking/:id returns the created booking', async ({
  request,
}) => {
  const created = await request.post(`${baseUrl}/booking`, { data: booking });
  const id = (await created.json()).bookingid;

  const response = await request.get(`${baseUrl}/booking/${id}`);

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toEqual(booking);
});

test('POST /booking creates a booking and returns it', async ({
  request,
}) => {
  const response = await request.post(`${baseUrl}/booking`, { data: booking });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(typeof body.bookingid).toBe('number');
  expect(body.booking).toEqual(booking);
});

test('PUT /booking/:id updates a booking when authenticated', async ({
  request,
}) => {
  const auth = await request.post(`${baseUrl}/auth`, { data: creds });
  const token = (await auth.json()).token;

  const created = await request.post(`${baseUrl}/booking`, { data: booking });
  const id = (await created.json()).bookingid;

  const update = { ...booking, firstname: 'Updated', totalprice: 999 };
  const response = await request.put(`${baseUrl}/booking/${id}`, {
    headers: { Cookie: `token=${token}` },
    data: update,
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toEqual(update);
});

test('DELETE /booking/:id removes a booking when authenticated', async ({
  request,
}) => {
  const auth = await request.post(`${baseUrl}/auth`, { data: creds });
  const token = (await auth.json()).token;

  const created = await request.post(`${baseUrl}/booking`, { data: booking });
  const id = (await created.json()).bookingid;

  const deleteResponse = await request.delete(`${baseUrl}/booking/${id}`, {
    headers: { Cookie: `token=${token}` },
  });
  expect(deleteResponse.status()).toBe(201);

  const check = await request.get(`${baseUrl}/booking/${id}`);
  expect(check.status()).toBe(404);
});
