// Fit the actual space left by the controls, rather than subtracting a fixed
// amount from the viewport. Re-run when the board's container changes size.
export function fitGrid(width, height, count, gap = 10) {
  let best = {columns: count, rows: 1, cardWidth: 0};
  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const cardWidth = Math.max(0, Math.min(
      (width - gap * (columns - 1)) / columns,
      (height - gap * (rows - 1)) / rows * 5 / 7
    ));
    // Prefer a complete rectangle when two layouts have almost equal size.
    const quality = cardWidth * (columns * rows === count ? 1.04 : 1);
    if (quality > (best.quality || 0)) best = {columns, rows, cardWidth, quality};
  }
  return best;
}
