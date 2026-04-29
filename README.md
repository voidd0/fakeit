# fakeit

[![npm version](https://img.shields.io/npm/v/@v0idd0/fakeit.svg?color=A0573A)](https://www.npmjs.com/package/@v0idd0/fakeit)
[![npm downloads](https://img.shields.io/npm/dw/@v0idd0/fakeit.svg?color=1F1A14)](https://www.npmjs.com/package/@v0idd0/fakeit)
[![License: MIT](https://img.shields.io/badge/license-MIT-A0573A.svg)](LICENSE)
[![Node ≥14](https://img.shields.io/badge/node-%E2%89%A514-1F1A14)](package.json)

Generate realistic fake test data. Seedable, schemable, fast.

```
$ fakeit name email phone --count 3
name,email,phone
nora park,nora.park@example.com,+1-415-555-0143
kai obasanjo,kai.obasanjo@example.com,+44-20-7946-0382
yuki tanaka,yuki.tanaka@example.com,+81-3-7946-0192
```

## Why fakeit

You need a fixture file with 100 plausible-looking users for staging. The big faker libraries (`@faker-js/faker`) are 3+ MB and pull in every locale. You don't need every locale; you need a CSV in 200ms. fakeit is that subset: realistic names from many cultures (curated, not generated), test-card numbers that pass Luhn, phone numbers in legally-reserved fictional ranges, all behind a single CLI that defaults to CSV output.

## Install

```bash
npm install -g @v0idd0/fakeit
```

## Usage

```bash
# Basic
fakeit name email --count 5

# JSON output
fakeit name address --json

# Reproducible with seed
fakeit name email --count 100 --seed 42 > fixtures.csv

# All fields
fakeit name email phone address company creditCard isbn iban date paragraph
```

## Available fields

| Field | Example |
|---|---|
| `name` | nora park |
| `firstName` | nora |
| `lastName` | park |
| `email` | nora.park@example.com |
| `phone` | +1-415-555-0143 |
| `address` | 1234 main st, tel aviv, IL 12345 |
| `street` | 1234 main st |
| `city` | tel aviv |
| `country` | IL |
| `zip` | 12345 |
| `company` | orbital labs |
| `isbn` | 978… (valid ISBN-13) |
| `creditCard` | 4242… (passes Luhn, test prefix) |
| `iban` | DE89… (valid format) |
| `date` | 2024-08-13 |
| `paragraph` | lorem ipsum dolor sit amet… |
| `lorem` | multi-paragraph lorem |

## Test data, not real data

- Phones use `555` prefix (US) or `7946` (UK fictional film range) — no real numbers will be reached.
- Emails use `@example.com` (RFC 2606 reserved domain).
- Credit cards start with `4242` (Stripe test card prefix) and pass Luhn.
- IBANs are valid format, fictitious account.
- Names are a curated mix from many cultures, not LLM-generated. We hand-pick to avoid stereotyped pairings.

## Compared to alternatives

| tool | bundle size | locales | seedable | CLI |
|---|---|---|---|---|
| fakeit | ~25 KB | mixed by default | yes | yes (CSV/JSON) |
| `@faker-js/faker` | ~3 MB | 75+ via locale packs | yes | community CLIs |
| Mockaroo | web only | many | yes | web only |
| `chance.js` | ~80 KB | English | yes | community CLIs |

For complex schema-driven generation with relations between fields (orders → users → addresses), `@faker-js/faker` plus a small generator script is the right tool. For CSV/JSON fixtures of independent records, fakeit is the smaller hammer.

## FAQ

**Are credit-card numbers really "safe"?** They're prefixed with `4242` (Visa test card namespace) and pass Luhn. They are not bound to any real account but are recognized by Stripe/Adyen sandboxes as test cards.

**Why are phones US/UK only?** Because those are the two ranges with explicit fictional-number reservations (US 555, UK 020 7946). We refuse to generate other countries' numbers because they could collide with real subscribers.

**How stable are seeds across versions?** Seed → output is stable within a major version (`1.x.x`). When we bump major, we may rotate the wordlists; fixture files that were checked in still parse, but regenerating with the same seed in a new major may produce different rows.

**Why no `password` field?** Because tests should never seed users with weak passwords, even for show. Use `passgen` (sister tool) and feed its output through your own hash function.

## Programmatic API

```javascript
import { generate, Faker } from '@v0idd0/fakeit';

// Quick API
const users = generate(['name', 'email'], 100, 42);

// Or finer control with Faker class
const f = new Faker(42);
const user = {
  name:    f.name(),
  email:   f.email(),
  isbn:    f.isbn(),
  joined:  f.date({ from: '2020-01-01' }),
};
```

## More from the studio

This is one tool out of many — see [`from-the-studio.md`](from-the-studio.md) for the full lineup of vøiddo products (other CLI tools, browser extensions, the studio's flagship products and games).

## From the same studio

- **[@v0idd0/jsonyo](https://www.npmjs.com/package/@v0idd0/jsonyo)** — JSON swiss army knife, 18 commands, zero limits
- **[@v0idd0/envguard](https://www.npmjs.com/package/@v0idd0/envguard)** — stop shipping `.env` drift to staging
- **[@v0idd0/depcheck](https://www.npmjs.com/package/@v0idd0/depcheck)** — find unused dependencies in one command
- **[@v0idd0/gitstats](https://www.npmjs.com/package/@v0idd0/gitstats)** — git repo analytics, one command
- **[View all tools →](https://voiddo.com/tools/)**

## License

MIT.

---

Built by [vøiddo](https://voiddo.com/) — a small studio shipping AI-flavoured products, free dev tools, Chrome extensions and weird browser games.
