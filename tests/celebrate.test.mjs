import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';

const theme = 'public/themes/hot-wheels/';
const deck = JSON.parse(readFileSync(theme + 'deck.json'));
const app = readFileSync('src/app.js', 'utf8');
const celebrate = readFileSync('src/celebrate.js', 'utf8');

test('every clip named in the deck exists and stays small', () => {
  const withClips = deck.cards.filter(card => card.clip);
  assert.equal(withClips.length, deck.cards.length, 'every car has a clip');
  for (const card of withClips) {
    assert.match(card.clip, /^clips\/[\w-]+\.mp4$/);
    assert.ok(existsSync(theme + card.clip), `${card.clip} is missing`);
    assert.ok(statSync(theme + card.clip).size < 900_000, `${card.clip} is too big for phones`);
  }
});

test('a human match pauses play for the celebration, then carries on', () => {
  assert.match(app, /if\(matchId&&!bot\)/);
  assert.match(app, /celebrating=true/);
  assert.match(app, /if\(introActive\|\|paused\|\|celebrating\|\|/);
  assert.match(app, /#pause'\)\.onclick=\(\)=>\{cancelCelebration\(\);/);
});

test('clips play silently inline and the celebration can always be skipped', () => {
  assert.match(celebrate, /muted: true, playsInline: true/);
  assert.match(celebrate, /pointerdown', finish/);
  assert.match(celebrate, /setTimeout\(finish, 4800\)/);
});

test('cars without a clip still get a short celebration', () => {
  assert.match(celebrate, /setTimeout\(finish, reducedMotion \? 1200 : 1900\)/);
});

test('menu race scene, perfect-race flag and transparent logo ship with the game', () => {
  for (const f of ['scenes/menu-race.mp4', 'scenes/menu-race.webp', 'scenes/perfect-finish.mp4', 'logo.png', 'web/logo.webp'])
    assert.ok(existsSync(theme + f), `${f} is missing`);
  assert.ok(statSync(theme + 'scenes/menu-race.mp4').size < 1_200_000);
  assert.match(app, /menu-scene-video/);
  assert.match(app, /scenes\/perfect-finish\.mp4/);
});

test('the garage can make any car come to life', () => {
  assert.match(app, /id="play-car"/);
  assert.match(app, /image\.onclick=playCar/);
});
