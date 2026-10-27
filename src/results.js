// Results screen helpers: stars for solo races and the cars collected.
// Turns count every pair of flips, so a perfect race takes one turn per pair.

// Kid-friendly thresholds: finishing always earns a star.
//  Easy (3 pairs):   3★ ≤ 5 turns, 2★ ≤ 8
//  Medium (6 pairs): 3★ ≤ 9 turns, 2★ ≤ 15
//  Hard (8 pairs):   3★ ≤ 12 turns, 2★ ≤ 20
export function starRating(pairs, moves) {
  if (!Number.isInteger(pairs) || pairs < 1 || !Number.isInteger(moves) || moves < pairs) return {stars: 1, perfect: false};
  const perfect = moves === pairs;
  const stars = moves <= Math.ceil(pairs * 1.5) ? 3 : moves <= Math.ceil(pairs * 2.5) ? 2 : 1;
  return {stars, perfect};
}

// Matched cars in the order they were found, using only approved deck cards.
export function foundCars(game, cards) {
  return (game.matched || []).map(id => cards.find(card => card.id === id)).filter(Boolean);
}

export function starMessage(stars) {
  return stars === 3 ? 'Super speedy racing!' : stars === 2 ? 'Great racing!' : 'You did it! Race again for more stars.';
}
