# fakeit

Generate realistic fake test data. Seedable, schemable, fast.

```
$ fakeit name email phone --count 3
name,email,phone
nora park,nora.park@example.com,+1-415-555-0143
kai obasanjo,kai.obasanjo@example.com,+44-20-7946-0382
yuki tanaka,yuki.tanaka@example.com,+81-3-7946-0192
```

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

- Phones use `555` prefix (US) or `7946` (UK fictional film range) — no real numbers.
- Emails use `@example.com` (RFC 2606 reserved).
- Credit cards start with `4242` (Stripe test card prefix).
- Names are a curated mix from many cultures, not generated.

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

## License

MIT — part of the [vøiddo](https://voiddo.com) tools collection.

---

Built by [vøiddo](https://voiddo.com/) — a small studio shipping AI-flavoured products, free dev tools, Chrome extensions and weird browser games.
