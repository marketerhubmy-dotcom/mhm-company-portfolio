"""Convert raw PNG captures into responsive WebP files.

  python3 scripts/media/optimize.py <rawDir> public/projects

Writes <name>-<width>.webp for each target width and prints width/height
so the metadata JSON can declare intrinsic sizes (prevents layout shift).
"""
import sys, pathlib
from PIL import Image

raw, dest = map(pathlib.Path, sys.argv[1:3])
for png in sorted(raw.glob('*/*.png')):
    im = Image.open(png).convert('RGB')
    mobile = im.width < im.height
    widths = [780, 390] if mobile else [1600, 800]
    out = dest / png.parent.name
    out.mkdir(parents=True, exist_ok=True)
    for w in widths:
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(out / f'{png.stem}-{w}.webp', 'WEBP', quality=80, method=6)
    print(f'{png.parent.name}/{png.stem}: {widths[0]}x{round(im.height*widths[0]/im.width)}')
