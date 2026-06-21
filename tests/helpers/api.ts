import { APIRequestContext, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export const ADMIN_CREDS = {
  username: process.env.BOOKER_USERNAME,
  password: process.env.BOOKER_PASSWORD,
};

export const BASIC_AUTH =
  'Basic ' +
  Buffer.from(`${ADMIN_CREDS.username}:${ADMIN_CREDS.password}`).toString(
    'base64'
  );

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

//format date to YYYY-MM-DD
const asDate = (d: Date) => d.toISOString().slice(0, 10);

export function validBooking(overrides: Partial<Booking> = {}): Booking {
  const checkin = faker.date.soon({ days: 30 });
  const checkout = faker.date.soon({ days: 14, refDate: checkin });

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 1, max: 5000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: asDate(checkin),
      checkout: asDate(checkout),
    },
    additionalneeds: faker.helpers.arrayElement([
      'Breakfast',
      'Lunch',
      'Dinner',
      'Late checkout',
    ]),
    ...overrides,
  };
}

export async function getToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/auth', { data: ADMIN_CREDS });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.token).toBeTruthy();
  return body.token as string;
}

export async function createBooking(
  request: APIRequestContext,
  booking: Booking = validBooking()
): Promise<number> {
  const response = await request.post('/booking', { data: booking });
  expect(response.status()).toBe(200);
  const body = await response.json();
  return body.bookingid as number;
}
