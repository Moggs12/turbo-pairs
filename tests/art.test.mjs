import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {artUrl} from '../src/art.js';

const theme = 'public/themes/hot-wheels/';
const deck = JSON.parse(readFileSync(theme + 'deck.json'));

test('source deck keeps the approved PNG names', () => {
  assert.equal(artUrl('themes/hot-wheels/', '01-flame-racer.png', deck), 'themes/hot-wheels/01-flame-racer.png');
});

test('release deck swaps in the small WebP copy', () => {
  assert.equal(artUrl('themes/hot-wheels/', '01-flame-racer.png', {...deck, web: 'web/'}), 'themes/hot-wheels/web/01-flame-racer.webp');
});

test('saved games with PNG names still show art in the release', () => {
  const saved = {id: '04', file: '04-banana-buggy.png'};
  assert.equal(artUrl('b/', saved.file, {web: 'web/'}), 'b/web/04-banana-buggy.webp');
});

test('every approved card and the back has a WebP copy', () => {
  for (const file of [deck.back, ...deck.cards.map(card => card.file)]) {
    const copy = theme + 'web/' + file.replace(/\.png$/i, '.webp');
    assert.ok(existsSync(copy), `${copy} is missing — run python3 scripts/make-web-images.py`);
  }
});

test('offline template has the placeholders the build fills in', () => {
  const template = readFileSync('scripts/sw-template.js', 'utf8');
  assert.match(template, /'__RELEASE__'/);
  assert.match(template, /__PRECACHE__/);
});
