# WMS API Test Framework

A Playwright API test framework for a **Warehouse Management System (WMS Verify)** — a real NestJS/Prisma backend for warehouse pallet verification. This suite tests authentication, role-based access control, and the harder problems of a concurrent system: **lock contention (race conditions)** and **idempotent verification**.

---

## About

I'm a QA Engineer with 3.5 years of manual testing experience in e-commerce, expanding into
test automation. This framework tests a warehouse backend over HTTP, focusing on the scenarios
that actually break real systems — concurrent access, duplicate requests, and permission boundaries —
not just happy paths.

The backend under test (WMS Verify) is my own project: a NestJS API with PostgreSQL/Prisma,
Redis/BullMQ, and a React Native mobile client, modelling warehouse order and pallet verification.

---

## What this framework demonstrates

- **API testing** — a layered service architecture over Playwright's `request` client
- **Authentication** — JWT login flow, with per-role pre-authenticated fixtures
- **RBAC testing** — proving each role can only do what it's permitted to (and is denied the rest)
- **Concurrency testing** — a genuine race condition: two operators competing for the same lock
- **Idempotency testing** — duplicate verifications deduplicated, not duplicated or crashed
- **Boundary & validation testing** — exact-limit vs. over-limit, rejected unexpected fields
- **Mature test judgment** — documented decisions on unsafe-to-run tests (see notes)

---

## Tech stack

- **Playwright Test** — runner + `request` API client
- **JavaScript (Node.js)** — CommonJS modules
- **Tests the:** WMS Verify backend (NestJS / PostgreSQL / Prisma / Redis)

---

## Project structure

```
.
├── services/               # API service layer (one module per resource)
│   ├── auth.service.js         #   login
│   ├── orders.service.js       #   create / get / list orders
│   ├── lock.service.js         #   acquire / heartbeat / release / get lock
│   └── verification.service.js #   verify pallet / history
├── fixtures/
│   └── auth.fixture.js     # per-role pre-authenticated request contexts
├── utils/
│   └── dataFactory.js      # unique test data (customers, materials)
├── tests/
│   ├── health.spec.js          #   smoke test (API + DB up)
│   ├── auth.spec.js            #   login + negative
│   ├── auth-matrix.spec.js     #   data-driven: every role → correct role
│   ├── rbac.spec.js            #   role permission denials + positive control
│   ├── orders.spec.js          #   orders list + visibility
│   ├── lock.spec.js            #   lock lifecycle
│   ├── lock-race.spec.js       #   ★ concurrent lock race condition
│   ├── verification.spec.js    #   ★ idempotent verification
│   └── validation.spec.js      #   boundary + validation edge cases
└── playwright.config.js
```

---

## Highlighted scenarios

### ★ Concurrent lock race condition (`lock-race.spec.js`)
Two operators attempt to lock the **same order simultaneously** (fired together with
`Promise.all`). The test asserts exactly one succeeds (`200`) and one is rejected (`409 Conflict`),
then confirms the order ends up locked by exactly one of them — proving the system resolves
concurrent contention to a single consistent state.

### ★ Idempotent verification (`verification.spec.js`)
A pallet verification is sent **twice with the same `clientGeneratedId`** (simulating a mobile
network retry). The test asserts both calls return `200`, the first is treated as new
(`idempotent: false`), the second is recognised as a duplicate (`idempotent: true`), and both
return the **same** verification record — proving deduplication, not a crash or a double-insert.

### Role-based access control (`rbac.spec.js`)
Operators are denied admin-only actions (`403`), with a positive control confirming admins
*can* perform them — proving the permission system blocks the right people without blocking everyone.

---

## Running the tests

The framework tests a **locally running** WMS Verify backend.

**1. Start the backend** (in the WMS Verify project):
```bash
docker compose up -d          # Postgres + Redis
npm run prisma:migrate        # once
npm run prisma:seed           # seed test data
npm run start:dev --workspace apps/api   # API on http://localhost:3000
```

**2. Run the tests** (in this framework):
```bash
npm ci
npm test                      # run all specs
npm run report                # open the HTML report
```

> **Test data note:** some tests consume seed data (e.g. verifying unverified pallets).
> Re-run `npm run prisma:seed` in the backend to reset to a clean state.

---

## Continuous Integration

These tests run against a locally hosted backend rather than in a public CI pipeline, because
the WMS Verify backend is a private project. In an environment with access to the backend (an
internal runner, or the app's own repo), the suite would be CI'd by standing up Postgres and
Redis as service containers, building and seeding the API, then running `npm test` — the same
pattern used in my [playwright-qa-framework](https://github.com/CallumGit/playwright-qa-framework)
repo, which does run its full suite automatically via GitHub Actions.

---

## Notes on test design

- **Rate limiting:** the API throttles rapid logins (`429`), so tests log in once per role via
  fixtures and reuse the authenticated context rather than re-authenticating per request.
- **Safe-to-run judgment:** the last-admin-protection test is intentionally `test.skip`-ped —
  it is correct, but deactivating the shared admin account would break every other test.
  Testing it safely needs an isolated throwaway admin. Documenting the decision is deliberate.
- **Discovery-driven:** payload shapes (e.g. the verification body) were reverse-engineered by
  probing the API's validation responses, then asserted against the confirmed structure.

---

## About me

**Callum Turner** — QA Engineer (Manual → Automation)

3.5 years of manual QA in e-commerce: API testing (Postman), test design & execution (TestRail),
defect tracking (Jira), SQL, and log analysis (GCP, Graylog), in Agile/Scrum teams.
Building automation with Playwright and JavaScript.

- GitHub: [@CallumGit](https://github.com/CallumGit)
- LinkedIn: [callum-turner-46447a219](https://www.linkedin.com/in/callum-turner-46447a219/)
