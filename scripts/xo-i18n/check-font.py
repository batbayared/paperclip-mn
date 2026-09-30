#!/usr/bin/env python3
"""Inter woff2 фонтуудад монгол кирилл (70 code point) бүрэн байгаа эсэхийг шалгана."""
import sys
from pathlib import Path

try:
    from fontTools.ttLib import TTFont
except ImportError:
    print("fontTools олдсонгүй: python3 -m pip install --user fonttools brotli")
    sys.exit(2)

ROOT = Path(__file__).resolve().parents[2]
FONTS = [
    ROOT / "ui/public/fonts/InterVariable.woff2",
    ROOT / "ui/public/fonts/InterVariable-Italic.woff2",
]
# А–я (U+0410–U+044F) + Ёё + Үү + Өө
REQUIRED = list(range(0x0410, 0x0450)) + [0x0401, 0x0451, 0x04AE, 0x04AF, 0x04E8, 0x04E9]


def check(path: Path) -> int:
    rel = path.relative_to(ROOT)
    if not path.is_file():
        print(f"{rel}: файл олдсонгүй")
        return 1
    try:
        font = TTFont(str(path))
    except ImportError:
        print("brotli олдсонгүй: python3 -m pip install --user brotli")
        sys.exit(2)
    cmap = font.getBestCmap()
    missing = [cp for cp in REQUIRED if cp not in cmap]
    if missing:
        listed = " ".join(f"U+{cp:04X}({chr(cp)})" for cp in missing)
        print(f"{rel}: ДУТУУ {len(missing)} тэмдэгт: {listed}")
        return 1
    print(f"{rel}: OK ({len(REQUIRED)} кирилл тэмдэгт бүгд байна)")
    return 0


def main() -> int:
    status = 0
    for path in FONTS:
        status = max(status, check(path))
    return status


if __name__ == "__main__":
    sys.exit(main())
