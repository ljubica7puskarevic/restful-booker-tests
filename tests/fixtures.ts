import { test as base, expect } from '@playwright/test';
import { Booking, createBooking as postBooking, getToken } from './helpers/api';

type Fixtures = {
  token: string;
  createBooking: (booking?: Booking) => Promise<number>;
};

export const test = base.extend<Fixtures>({
  // Hands a fresh auth token to any test that asks for one.
  token: async ({ request }, use) => {
    await use(await getToken(request));
  },

  // A booking factory that remembers everything it creates and deletes it once
  // the test ends, so we don't pile up leftovers on the shared instance.
  createBooking: async ({ request, token }, use) => {
    const created: number[] = [];

    await use(async (booking) => {
      const id = await postBooking(request, booking);
      created.push(id);
      return id;
    });

    await Promise.all(
      created.map((id) =>
        request
          .delete(`/booking/${id}`, {
            headers: { Cookie: `token=${token}` },
          })
          .catch(() => undefined)
      )
    );
  },
});

export { expect };
