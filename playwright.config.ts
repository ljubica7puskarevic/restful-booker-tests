import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// override so .env wins over machine vars like Windows' built-in USERNAME
dotenv.config({ override: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // Pure API suite: no browser is launched, so there are no browser projects.
  // The request fixture just needs a base URL and picks up trace settings.
  use: {
    baseURL: process.env.BASE_URL ?? 'https://restful-booker.herokuapp.com',
    trace: 'on-first-retry',
  },
});
