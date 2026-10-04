# lil2-remark-breaks

[remark-breaks](https://github.com/remarkjs/remark-breaks) 4.0.0 rewritten in typed [LilScript](https://lilscript.eddocu.com):
every line ending in text becomes a hard break (`<br>`), on the flat **lil2** pipeline, with the same trees as
upstream.

The transform walks the mdast arena's text nodes and splits them at `\r\n`, `\n` and `\r` into text and `break`
nodes (int kinds, no position, as upstream's find-and-replace leaves them). Inside the family it is compiled into
[lil2-react-markdown](https://github.com/yeargun/lil2-react-markdown)'s `full` flavor.

```js
import {fromMarkdown, markdownToHast} from '@itslil/lil2-remark-breaks'

markdownToHast('one\ntwo', false) // hast columns: p > ["one", br, "\n", "two"]
```

## Install

```bash
npm install @itslil/lil2-remark-breaks
```

TypeScript types are included. One ES module per entry; Node, Deno, Bun and workers get `dist/`, bundlers targeting
browsers get `dist/browser/` through the `browser` condition.

## Use

```ts
import {markdownToHast} from '@itslil/lil2-remark-breaks'
import {TAG_BR} from '@itslil/lil2-remark-breaks/constants'

const [, , , , , tag] = markdownToHast('roses are red\nviolets are blue')
console.log(tag.filter(t => t === TAG_BR).length) // 1: the line ending is a <br>
```

`fromMarkdown(value)` and `markdownToHast(value, allowDangerousHtml?)` are remark-parse (and remark-rehype) with
remark-breaks. In React, use `@itslil/lil2-react-markdown/full` with `plugins={[BREAKS]}`.

### Which package

| you want | package |
|---|---|
| React elements | [`@itslil/lil2-react-markdown`](https://github.com/yeargun/lil2-react-markdown) (`/gfm`, `/full` for GFM, math, KaTeX) |
| an HTML string, CommonMark | [`@itslil/lil2-micromark`](https://github.com/yeargun/lil2-micromark) |
| an HTML string with GFM, math or KaTeX | `renderToStaticMarkup` of lil2-react-markdown's `/full` flavor (below) |
| mdast (syntax tree) | [`lil2-mdast-util-from-markdown`](https://github.com/yeargun/lil2-mdast-util-from-markdown); with GFM [`lil2-remark-gfm`](https://github.com/yeargun/lil2-remark-gfm), math [`lil2-remark-math`](https://github.com/yeargun/lil2-remark-math), breaks [`lil2-remark-breaks`](https://github.com/yeargun/lil2-remark-breaks) |
| hast (HTML tree) | [`lil2-mdast-util-to-hast`](https://github.com/yeargun/lil2-mdast-util-to-hast) and the same three, or [`lil2-rehype-katex`](https://github.com/yeargun/lil2-rehype-katex) with formulas rendered |

Every package is one self-contained ES module with no runtime dependencies (React and KaTeX aside), ships its
TypeScript types, and resolves to a Node build or a browser build through its `exports` conditions.
## Measured (2026-10-04)

The `browser` build against remark-breaks@4.0.0 bundled for the browser with esbuild and minified by Terser, esbuild and Oxc
(the smallest shown). Each objective is its own LilScript build (effort level 12, `lazy_functions`).

| | lil2 | upstream, best minifier | difference |
|---|---:|---:|---:|
| raw | 59,016 | 75,302 (Terser) | −21.6% |
| gzip (9) | 19,337 | 20,862 (Terser) | −7.3% |
| Brotli (11) | 16,938 | 18,684 (Terser) | −9.3% |

Speed, upstream → lil2: markdown with breaks to HTML, median per call in a fresh browser context per lane, after checking that both
give the same output (Playwright; Chromium 151, Firefox 153; AMD EPYC 7763 64-Core Processor). Cold rows are the first import and the
first call of a fresh page.

| | Chromium | Firefox |
|---|---:|---:|
| chat (1 KB) | 0.71 → 0.27 ms (0.38×) | 1.11 → 0.54 ms (0.48×) |
| readme (26 KB) | 15.7 → 6.40 ms (0.41×) | 32.0 → 13.0 ms (0.41×) |
| import, cold | 5.00 → 5.20 ms | 11.0 → 11.0 ms |
| first call, cold | 11.8 → 11.0 ms | 15.0 → 11.0 ms |

## Behaviour

`test/differential.test.mjs` compares the mdast and the hast with upstream's (`newlineToBreak(fromMarkdown(md))`)
as rows of indexed arrays on line-ending edge cases and the CommonMark corpus; `test/browser.test.mjs` runs the
browser build in Chromium and Firefox. All are equal.

## License

MIT; see NOTICE.md.
