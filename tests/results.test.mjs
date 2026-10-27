import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {starRating, foundCars, starMessage} from '../src/results.js';

const deck = JSON.parse(readFileSync('public/themes/hot-wheels/deck.json'));

test('one turn per pair is a perfect three-star race on every difficulty', () => {
  for (const pairs of [3, 6, 8]) assert.deepEqual(starRating(pairs, pairs), {stars: 3, perfect: true});
});

test('star thresholds for Easy, Medium and Hard', () => {
  const cases = {3: [[5, 3], [6, 2], [8, 2], [9, 1]], 6: [[9, 3], [10, 2], [15, 2], [16, 1]], 8: [[12, 3], [13, 2], [20, 2], [21, 1]]};
  for (const [pairs, list] of Object.entries(cases))
    for (const [moves, stars] of list) assert.equal(starRating(Number(pairs), moves).stars, stars, `${pairs} pairs in ${moves} turns`);
});

test('finishing always earns at least one star, even with odd saved data', () => {
  assert.equal(starRating(3, 40).stars, 1);
  assert.deepEqual(starRating(3, 1), {stars: 1, perfect: false});
  assert.deepEqual(starRating(undefined, 4), {stars: 1, perfect: false});
});

test('collected cars come back in the order they were found', () => {
  const cars = foundCars({matched: ['13', '04', 'zz']}, deck.cards);
  assert.deepEqual(cars.map(c => c.name), ['Burger Buggy', 'Banana Buggy']);
  assert.deepEqual(foundCars({}, deck.cards), []);
});

test('every star count has a message', () => {
  for (const n of [1, 2, 3]) assert.ok(starMessage(n).length > 5);
});
