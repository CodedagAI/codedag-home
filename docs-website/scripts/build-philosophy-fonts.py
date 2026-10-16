# /// script
# requires-python = ">=3.10"
# dependencies = ["fonttools[woff]==4.60.1"]
# ///
"""Regenerate design-philosophy card fonts from licensed upstream TTFs."""

import argparse
import html
from pathlib import Path
import re

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


SITE = Path(__file__).resolve().parents[1]
OUTPUT = SITE / "public/fonts/philosophy"


def build(source, document, family, filename, weight=None):
    mdx = (SITE / "content/docs" / document).read_text(encoding="utf-8")
    card = re.search(
        r'<ul\b[^>]*className="philosophy-principles"[^>]*>(.*?)</ul>',
        mdx,
        re.S,
    )
    if card is None:
        raise ValueError(f"No philosophy card in {document}")
    titles = re.findall(r"<a\b[^>]*>(.*?)</a>", card.group(1), re.S)
    if len(titles) != 8:
        raise ValueError(f"Expected eight principles in {document}")
    text = html.unescape("".join(titles))
    font = TTFont(source)
    missing = set(map(ord, text)) - set(font.getBestCmap())
    if missing:
        raise ValueError(f"{source} is missing characters: {sorted(missing)}")

    options = subset.Options()
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    options.layout_features = ["*"]
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    if weight is not None:
        font = instantiateVariableFont(font, {"wght": weight}, inplace=True)

    # These are modified web subsets, not upstream desktop font releases.
    # Distinct family names avoid using the upstream reserved font names.
    names = {
        1: family,
        2: "Regular",
        3: family.replace(" ", "") + "-Regular",
        4: family + " Regular",
        6: family.replace(" ", "") + "-Regular",
        16: family,
        17: "Regular",
    }
    for record in font["name"].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())

    OUTPUT.mkdir(parents=True, exist_ok=True)
    destination = OUTPUT / filename
    font.flavor = "woff2"
    font.save(destination)
    font.close()
    print(f"{destination.name}: {destination.stat().st_size:,} bytes")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--wenkai", type=Path)
    parser.add_argument("--source-serif", type=Path)
    parser.add_argument("--noto-serif-jp", type=Path)
    args = parser.parse_args()
    if not any((args.wenkai, args.source_serif, args.noto_serif_jp)):
        parser.error("Provide at least one upstream font path.")
    for source, document, family, filename, weight in (
        (
            args.wenkai,
            "introduction/design-philosophy.zh.mdx",
            "CodeDAG Philosophy Kai",
            "philosophy-kai-400.woff2",
            None,
        ),
        (
            args.source_serif,
            "introduction/design-philosophy.mdx",
            "CodeDAG Philosophy Serif",
            "philosophy-serif-400.woff2",
            None,
        ),
        (
            args.noto_serif_jp,
            "introduction/design-philosophy.ja.mdx",
            "CodeDAG Philosophy Mincho",
            "philosophy-mincho-400.woff2",
            400,
        ),
    ):
        if source is not None:
            build(source, document, family, filename, weight)
