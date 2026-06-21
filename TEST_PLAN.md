# Test plan – Restful-Booker API

This is my plan for testing the restful-booker API. I started with the basics:
check that each endpoint works, that the API says no when it should, and write
down the bugs I ran into along the way.

A couple of things to know:

- The API lives at `https://restful-booker.herokuapp.com`.
- It's a shared practice API and the data resets every ~10 minutes, so each test
  makes its own data instead of trusting whatever is already there.

## How I picked the tests

Nothing fancy, just the usual ideas:

- a good example and a bad example for each case,
- the edges, like a checkout date that's before the checkin date,
- who is allowed to do what on the login-protected endpoints,
- the whole create → read → update → delete journey,
- and poking at the usual weak spots: missing fields, wrong types, ids that don't
  exist.

## What I automated

12 tests in total — 9 pass, and 3 fail on purpose because they catch real bugs.

**Happy paths (one per endpoint)**

- log in and get a token
- list all bookings
- get a single booking back
- create a booking
- update a booking (logged in)
- delete a booking (logged in)
- ping the health check

**Negative / security**

- a wrong password gives no token
- updating a booking without a token is blocked (403)

**Bugs (these fail on purpose)**

- a wrong login should be 401, but the API returns 200
- a booking with checkout before checkin should be rejected, but it's accepted
- deleting a booking that doesn't exist should be 404, but the API returns 405

## What I'd add if I had more time

- More login cases: unknown username, empty body.
- Filtering the booking list by name or date. I skipped this for now because on a
  shared instance other people's data changes the counts, so it's not stable to
  check.
- More create cases: empty names, a price of 0 or a negative price, wrong types.
- The Basic-auth way of logging in, and PATCH (partial update).

So every endpoint has at least one test, the main risks are covered, and the rest
is written down here ready to pick up. How to run everything is in the
[README](./README.md).
