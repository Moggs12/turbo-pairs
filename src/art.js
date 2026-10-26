// Card art paths. Saved games keep the approved PNG file names, so the
// release build only adds deck.web (for example "web/") and this swaps in the
// matching small WebP copy when the picture is shown.
export function artUrl(base, file, deck) {
  if (!deck?.web || typeof file !== 'string') return base + file;
  return base + deck.web + file.replace(/\.png$/i, '.webp');
}
