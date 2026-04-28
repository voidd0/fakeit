import { generate, Faker } from './src/index.js';
import assert from 'node:assert';

function it(name, fn) {
  try { fn(); console.log(`  ok ${name}`); }
  catch (e) { console.error(`  FAIL ${name}: ${e.message}`); process.exitCode = 1; }
}

console.log('fakeit smoke tests');

it('generates correct number of rows', () => {
  const rows = generate(['name'], 5);
  assert.equal(rows.length, 5);
});

it('seedable — same seed = same output', () => {
  const a = generate(['name', 'email'], 3, 42);
  const b = generate(['name', 'email'], 3, 42);
  assert.deepEqual(a, b);
});

it('seedable — different seeds = different output', () => {
  const a = generate(['name'], 1, 1);
  const b = generate(['name'], 1, 2);
  assert.notDeepEqual(a, b);
});

it('email contains @example.com', () => {
  const rows = generate(['email'], 5, 1);
  for (const r of rows) assert.match(r.email, /@example\.com$/);
});

it('isbn-13 is 13 digits', () => {
  const rows = generate(['isbn'], 5, 1);
  for (const r of rows) assert.match(r.isbn, /^\d{13}$/);
});

it('isbn-13 has valid check digit', () => {
  const rows = generate(['isbn'], 10, 1);
  for (const r of rows) {
    const isbn = r.isbn;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const d = parseInt(isbn[i], 10);
      sum += i % 2 === 0 ? d : d * 3;
    }
    const expected = (10 - (sum % 10)) % 10;
    assert.equal(parseInt(isbn[12], 10), expected, `bad isbn: ${isbn}`);
  }
});

it('credit card passes Luhn', () => {
  const rows = generate(['creditCard'], 10, 1);
  for (const r of rows) {
    const cc = r.creditCard;
    assert.match(cc, /^4242\d{12}$/);
    let sum = 0;
    for (let i = 0; i < 16; i++) {
      let d = parseInt(cc[15 - i], 10);
      if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
    }
    assert.equal(sum % 10, 0, `bad luhn: ${cc}`);
  }
});

it('unknown field throws', () => {
  assert.throws(() => generate(['nope'], 1), /unknown field/);
});

it('paragraph ends with period', () => {
  const f = new Faker(7);
  const p = f.paragraph(10);
  assert.match(p, /\.$/);
});

console.log('done');
