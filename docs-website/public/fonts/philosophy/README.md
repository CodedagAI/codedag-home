# Design philosophy card fonts

Only the eight principles at the top of the design philosophy pages use these fonts. Chinese uses LXGW WenKai, English uses Source Serif 4, and Japanese uses Noto Serif JP, all at weight 400. Other document text keeps the site's existing typography.

The WOFF2 files contain only the characters in their respective cards. Glyph outlines are not redesigned. The subsets use the distinct family names `CodeDAG Philosophy Kai`, `CodeDAG Philosophy Serif`, and `CodeDAG Philosophy Mincho`; upstream copyright notices and SIL OFL 1.1 licenses are retained. Source Serif 4 retains its variable axes, including optical sizing. Noto Serif JP is instantiated at weight 400.

## Sources and licenses

- **LXGW WenKai:** [upstream font](https://github.com/lxgw/LxgwWenKai/blob/main/fonts/TTF/LXGWWenKai-Regular.ttf), [included license](./LXGW-WenKai-OFL.txt). Source SHA-256: `39ad71264b588165b469e35e6afb162a378dacd1f95348160240ba9038ac3009`.
- **Source Serif 4:** [upstream font](https://github.com/google/fonts/blob/main/ofl/sourceserif4/SourceSerif4%5Bopsz%2Cwght%5D.ttf), [included license](./Source-Serif-4-OFL.txt). Source SHA-256: `97b2d4da6e3cb494b5a1e66ae176914d852ccabef49e0c02c0df25f3e39aca0b`.
- **Noto Serif JP:** [upstream font](https://github.com/google/fonts/blob/main/ofl/notoserifjp/NotoSerifJP%5Bwght%5D.ttf), [included license](./Noto-Serif-JP-OFL.txt). Source SHA-256: `2fd527ba12b6a44ec30d796d633360da0aeba6c5d4af1304ce12bb4dc15a7dfc`.

## Regeneration

After changing the eight principle sentences, regenerate the affected subsets from the licensed upstream TTFs. From the site directory (the one with `package.json`):

```sh
uv run scripts/build-philosophy-fonts.py \
  --wenkai /path/to/LXGWWenKai-Regular.ttf \
  --source-serif /path/to/SourceSerif4.ttf \
  --noto-serif-jp /path/to/NotoSerifJP.ttf
```

Pass only the font options you need to regenerate; other subsets are left unchanged. The script reads the formal MDX cards and uses its pinned fontTools dependency in an isolated environment. Font generation is a maintenance step, not a website build or runtime dependency. When changing upstream font versions, update the licenses and source hashes above.
