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

## Measured (2026-10-04)

The `browser` build against remark-breaks@4.0.0 bundled for the browser with esbuild and minified by Terser, esbuild and Oxc
(the smallest shown). Each objective is its own LilScript build (effort level 12, `lazy_functions`).

| | lil2 | upstream, best minifier | difference |
|---|---:|---:|---:|
| raw | 59,016 | 75,302 (Terser) | −21.6% |
| gzip (9) | 19,337 | 20,862 (Terser) | −7.3% |
| Brotli (11) | 16,921 | 18,684 (Terser) | −9.4% |

Speed, upstream → lil2: markdown with breaks to HTML, median per call in a fresh browser context per lane, after checking that both
give the same output (Playwright; Chromium 151, Firefox 153; AMD EPYC 7763 64-Core Processor). Cold rows are the first import and the
first call of a fresh page.

| | Chromium | Firefox |
|---|---:|---:|
| chat (1 KB) | 0.70 → 0.27 ms (0.39×) | 1.13 → 0.54 ms (0.48×) |
| readme (26 KB) | 15.8 → 6.37 ms (0.40×) | 34.0 → 12.5 ms (0.37×) |
| import, cold | 5.00 → 5.10 ms | 12.0 → 12.0 ms |
| first call, cold | 12.1 → 10.8 ms | 16.0 → 11.0 ms |

## Behaviour

`test/differential.test.mjs` compares the mdast and the hast with upstream's (`newlineToBreak(fromMarkdown(md))`)
as rows of indexed arrays on line-ending edge cases and the CommonMark corpus; `test/browser.test.mjs` runs the
browser build in Chromium and Firefox. All are equal.

## License

MIT; see NOTICE.md.
