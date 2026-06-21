# Restful-Booker API — Test Automation

Automated API test suite for the [restful-booker](https://restful-booker.herokuapp.com/apidoc/index.html)
API, built with [Playwright Test](https://playwright.dev/).

The suite covers authentication and full CRUD on the `/booking` resource across
positive, negative, security and defect-demonstrating dimensions.

The full set of designed test cases — positive and negative, tagged with the
test-design technique behind each — lives in [`TEST_PLAN.md`](./TEST_PLAN.md),
which also marks exactly which cases are automated here. 
---

## Setup

Requirements: **Node.js 18+** (LTS recommended).

```bash
npm ci                       # install dependencies (uses package-lock.json)
npx playwright install       # install browser binaries
```

## Running the suite

```bash
npm test                     # run everything

npm run test:positive        # CRUD happy-path checks
npm run test:negative        # negative / security checks
npm run test:bugs            # the defect-demonstrating tests (expected to fail)

npm run test:report          # open the HTML report from the last run
```

---

## Test strategy

It is covered in TEST_PLAN.md

---

## CI

`.github/workflows/playwright.yml` runs on every push/PR to `main`/`master` in
two jobs: a **quality** job (prettier, eslint, tsc) and a **test** job that runs
the suite and uploads the HTML report as a build artifact (`playwright-report/`).
The test job only runs once quality passes.
