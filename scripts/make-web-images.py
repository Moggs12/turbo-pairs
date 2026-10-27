"""Make small WebP copies of the approved card art for the release build.

The approved PNGs in public/themes/hot-wheels/ are never changed. This script
writes matching copies to public/themes/hot-wheels/web/, which the build ships
instead of the PNGs. Run it again whenever a card is added or replaced:

    pip install pillow
    python3 scripts/make-web-images.py

npm test checks that every card in deck.json has a WebP copy.
"""
import json
from pathlib import Path

from PIL import Image

THEME = Path(__file__).resolve().parent.parent / "public" / "themes" / "hot-wheels"
OUT = THEME / "web"
CARD_WIDTH = 800  # Sharp on 3x phone screens and in the full-card viewer.
CARD_QUALITY = 85
BACK_QUALITY = 90  # The back also supplies the large menu logo, so keep full width.

deck = json.loads((THEME / "deck.json").read_text())
OUT.mkdir(exist_ok=True)
jobs = [(deck["back"], None, BACK_QUALITY)] + [(c["file"], CARD_WIDTH, CARD_QUALITY) for c in deck["cards"]]

for name, width, quality in jobs:
    image = Image.open(THEME / name).convert("RGB")
    if width and image.width > width:
        image = image.resize((width, round(width * image.height / image.width)), Image.LANCZOS)
    target = OUT / (Path(name).stem + ".webp")
    image.save(target, "WEBP", quality=quality, method=6)
    print(f"{target.name}: {target.stat().st_size // 1024} KB")
