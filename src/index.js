// fakeit — realistic fake test data, seedable.
//
// Seedable PRNG (mulberry32) so the same seed produces the same dataset. Useful
// for reproducible test fixtures. No globally-shared state. Each Faker
// instance has its own seed.

const FIRST_NAMES = [
  'nora', 'kai', 'yuki', 'arjun', 'mira', 'ezra', 'leila', 'omar',
  'priya', 'noah', 'aoife', 'tariq', 'zara', 'isla', 'kenji', 'sofia',
  'malik', 'fatima', 'theo', 'amara', 'ravi', 'ines', 'jude', 'naia',
  'anya', 'bashir', 'callan', 'dara', 'efrat', 'finlay', 'gemma', 'hugo',
];
const LAST_NAMES = [
  'park', 'obasanjo', 'tanaka', 'sharma', 'rivera', 'cohen', 'okafor',
  'kowalski', 'nguyen', 'oconnell', 'silva', 'meyer', 'hassan', 'singh',
  'erikson', 'ramos', 'novak', 'patel', 'haddad', 'kruger', 'fontaine',
  'oduya', 'romano', 'mclean', 'bauer', 'okonkwo', 'lefevre', 'kazan',
];
const STREETS = [
  'main', 'oak', 'elm', 'park', 'maple', 'cedar', 'pine', 'birch',
  'hill', 'lake', 'river', 'forest', 'meadow', 'sunset', 'ridge',
];
const CITIES = [
  'tel aviv', 'tokyo', 'lisbon', 'rotterdam', 'mumbai', 'austin',
  'glasgow', 'porto', 'osaka', 'seville', 'helsinki', 'rotterdam',
];
const COUNTRIES = ['IL', 'JP', 'PT', 'NL', 'IN', 'US', 'GB', 'FI'];
const COMPANIES = [
  'orbital', 'haiku', 'merge', 'kepler', 'argo', 'nimbus', 'forge',
  'lattice', 'helix', 'beacon', 'pivot', 'circuit', 'umbra', 'mosaic',
];
const COMPANY_SUFFIX = ['labs', 'systems', 'works', 'inc', 'studio', 'group'];

const LOREM_WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod ' +
  'tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam ' +
  'quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo'
).split(' ');

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Faker {
  constructor(seed = Date.now()) {
    this.seed = seed >>> 0;
    this.rand = mulberry32(this.seed);
  }
  pick(arr) { return arr[Math.floor(this.rand() * arr.length)]; }
  int(min, max) { return Math.floor(this.rand() * (max - min + 1)) + min; }

  firstName() { return this.pick(FIRST_NAMES); }
  lastName()  { return this.pick(LAST_NAMES); }
  name()      { return `${this.firstName()} ${this.lastName()}`; }
  email() {
    return `${this.firstName()}.${this.lastName()}@example.com`;
  }
  phone() {
    // E.164-ish but not real. Use 555 prefix to avoid hitting real numbers.
    const cc = this.pick([1, 1, 44, 81, 49, 33, 972]);
    if (cc === 1) {
      return `+1-${this.int(200, 999)}-555-${String(this.int(0, 9999)).padStart(4, '0')}`;
    }
    return `+${cc}-${this.int(10, 99)}-7946-${String(this.int(0, 9999)).padStart(4, '0')}`;
  }
  street() {
    return `${this.int(1, 9999)} ${this.pick(STREETS)} ${this.pick(['st', 'ave', 'rd', 'ln'])}`;
  }
  city()    { return this.pick(CITIES); }
  country() { return this.pick(COUNTRIES); }
  zip()     { return String(this.int(10000, 99999)); }
  address() {
    return `${this.street()}, ${this.city()}, ${this.country()} ${this.zip()}`;
  }
  company() {
    return `${this.pick(COMPANIES)} ${this.pick(COMPANY_SUFFIX)}`;
  }
  isbn() {
    // ISBN-13 with valid check digit.
    let body = '978';
    for (let i = 0; i < 9; i++) body += this.int(0, 9);
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const d = parseInt(body[i], 10);
      sum += i % 2 === 0 ? d : d * 3;
    }
    const check = (10 - (sum % 10)) % 10;
    return body + check;
  }
  // Test-mode credit card. Valid Luhn but in IIN range reserved for tests.
  // 4242 4242 4242 4242 is the public Stripe test card; we generate similar.
  creditCard() {
    let body = '4242';
    for (let i = 0; i < 11; i++) body += this.int(0, 9);
    // Luhn check digit
    let sum = 0;
    for (let i = 0; i < 15; i++) {
      let d = parseInt(body[14 - i], 10);
      if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
    }
    const check = (10 - (sum % 10)) % 10;
    return body + check;
  }
  iban() {
    // Generic IBAN format: 2-letter country + 2-digit check + BBAN.
    const country = this.pick(['DE', 'FR', 'NL', 'IL', 'GB']);
    const len = { DE: 22, FR: 27, NL: 18, IL: 23, GB: 22 }[country];
    let bban = '';
    for (let i = 0; i < len - 4; i++) bban += this.int(0, 9);
    return `${country}${String(this.int(10, 99))}${bban}`;
  }
  date(opts = {}) {
    const start = (opts.from instanceof Date ? opts.from : new Date(opts.from || '2000-01-01')).getTime();
    const end   = (opts.to   instanceof Date ? opts.to   : new Date(opts.to   || '2026-12-31')).getTime();
    const t = start + this.rand() * (end - start);
    return new Date(t).toISOString().slice(0, 10);
  }
  paragraph(words = 32) {
    const out = [];
    for (let i = 0; i < words; i++) out.push(this.pick(LOREM_WORDS));
    return out.join(' ') + '.';
  }
  lorem(n = 1) {
    return Array.from({ length: n }, () => this.paragraph()).join('\n\n');
  }
}

export const FIELDS = {
  name: f => f.name(),
  firstName: f => f.firstName(),
  lastName: f => f.lastName(),
  email: f => f.email(),
  phone: f => f.phone(),
  address: f => f.address(),
  street: f => f.street(),
  city: f => f.city(),
  country: f => f.country(),
  zip: f => f.zip(),
  company: f => f.company(),
  isbn: f => f.isbn(),
  creditCard: f => f.creditCard(),
  iban: f => f.iban(),
  date: f => f.date(),
  paragraph: f => f.paragraph(),
  lorem: f => f.lorem(),
};

export function generate(fieldNames, count = 1, seed) {
  const faker = new Faker(seed ?? Date.now());
  const rows = [];
  for (let i = 0; i < count; i++) {
    const row = {};
    for (const fn of fieldNames) {
      const gen = FIELDS[fn];
      if (!gen) throw new Error(`unknown field: ${fn}. available: ${Object.keys(FIELDS).join(', ')}`);
      row[fn] = gen(faker);
    }
    rows.push(row);
  }
  return rows;
}
