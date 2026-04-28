#!/usr/bin/env node
import { generate, FIELDS } from '../src/index.js';

const args = process.argv.slice(2);

function help() {
  const fields = Object.keys(FIELDS).join(', ');
  console.log(`
fakeit — generate realistic fake test data.

  fakeit <field> [<field>...] --count N [--seed S] [--json]

fields:
  ${fields}

flags:
  --count N    number of rows (default 1)
  --seed S     numeric seed for reproducibility (default = current ms)
  --json       output as JSON (default = csv)
  -h, --help   show this

examples:
  fakeit name email phone --count 3
  fakeit name address --json
  fakeit isbn --count 10 --seed 42
`);
}

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  help();
  process.exit(0);
}

let count = 1;
let seed;
let json = false;
const fields = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--count') count = parseInt(args[++i], 10) || 1;
  else if (a === '--seed') seed = parseInt(args[++i], 10);
  else if (a === '--json') json = true;
  else if (a.startsWith('--')) { console.error(`unknown flag: ${a}`); process.exit(1); }
  else fields.push(a);
}

if (fields.length === 0) {
  console.error('fakeit: no fields given. try `fakeit --help`.');
  process.exit(1);
}

try {
  const rows = generate(fields, count, seed);
  if (json) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    // CSV
    console.log(fields.join(','));
    for (const r of rows) {
      console.log(fields.map(f => csvEscape(r[f])).join(','));
    }
  }
} catch (e) {
  console.error(`fakeit: ${e.message}`);
  process.exit(2);
}

function csvEscape(v) {
  const s = String(v);
  if (/[,"\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
